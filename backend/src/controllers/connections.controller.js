import prisma from '../db.js';
import geohash from 'ngeohash';

export async function sendRequest(req, res) {
  try {
    const { receiverId, introMessage } = req.body;
    const senderId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({ error: 'Receiver ID is required' });
    }

    if (introMessage && introMessage.length > 100) {
      return res.status(400).json({ error: 'Intro message exceeds 100 characters limit' });
    }

    // 1. Get sender and receiver details
    const [sender, receiver] = await prisma.$transaction([
      prisma.user.findUnique({ where: { id: senderId } }),
      prisma.user.findUnique({ where: { id: receiverId } })
    ]);

    if (!sender) return res.status(404).json({ error: 'Sender profile not found' });
    if (!receiver || !receiver.visibility || !receiver.isVerified) {
      return res.status(404).json({ error: 'User is currently unavailable' });
    }

    // 2. Block checks: generic "User is currently unavailable" to protect privacy
    const blocks = await prisma.report.findFirst({
      where: {
        OR: [
          { reporterId: senderId, reportedId: receiverId, reason: 'BLOCK' },
          { reporterId: receiverId, reportedId: senderId, reason: 'BLOCK' }
        ]
      }
    });

    if (blocks) {
      return res.status(404).json({ error: 'User is currently unavailable' });
    }

    // 3. Check proximity: sender and receiver must be in adjacent or same geohash
    if (!sender.geohash || !receiver.geohash) {
      return res.status(400).json({ error: 'Both users must have location enabled to connect' });
    }

    const senderNeighbors = [sender.geohash, ...geohash.neighbors(sender.geohash)];
    if (!senderNeighbors.includes(receiver.geohash)) {
      return res.status(400).json({ error: 'User is too far to connect' });
    }

    // 4. Check for active Match
    const existingMatch = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: senderId, userBId: receiverId, status: 'active' },
          { userAId: receiverId, userBId: senderId, status: 'active' }
        ]
      }
    });

    if (existingMatch) {
      return res.status(400).json({ error: 'You are already connected with this user' });
    }

    // 5. Check for pending requests
    const pendingRequest = await prisma.connectionRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: 'pending',
        expiresAt: { gt: new Date() }
      }
    });

    if (pendingRequest) {
      return res.status(400).json({ error: 'A pending request already exists' });
    }

    // 6. Check for declined requests within last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDecline = await prisma.connectionRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: 'declined',
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    if (recentDecline) {
      return res.status(400).json({ error: 'Cannot send another request within 30 days of a decline' });
    }

    // Create the pending request expiring in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const newRequest = await prisma.connectionRequest.create({
      data: {
        senderId,
        receiverId,
        introMessage,
        status: 'pending',
        expiresAt
      }
    });

    return res.json(newRequest);
  } catch (error) {
    console.error('Send request error:', error);
    return res.status(500).json({ error: 'Internal server error sending request' });
  }
}

export async function getRequests(req, res) {
  try {
    // Return all active pending requests for the logged-in user
    const pendingRequests = await prisma.connectionRequest.findMany({
      where: {
        receiverId: req.user.id,
        status: 'pending',
        expiresAt: { gt: new Date() }
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            bio: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json(pendingRequests);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error fetching requests' });
  }
}

export async function respondToRequest(req, res) {
  try {
    const { requestId, action } = req.body; // action: 'accept' | 'decline'
    const receiverId = req.user.id;

    if (!requestId || !action) {
      return res.status(400).json({ error: 'Request ID and action are required' });
    }

    if (!['accept', 'decline'].includes(action)) {
      return res.status(400).json({ error: 'Action must be accept or decline' });
    }

    const request = await prisma.connectionRequest.findUnique({
      where: { id: requestId }
    });

    if (!request || request.receiverId !== receiverId || request.status !== 'pending' || request.expiresAt < new Date()) {
      return res.status(404).json({ error: 'Active request not found' });
    }

    if (action === 'accept') {
      // Begin transaction to accept request and create active match
      await prisma.$transaction([
        prisma.connectionRequest.update({
          where: { id: requestId },
          data: { status: 'accepted' }
        }),
        prisma.match.upsert({
          where: {
            userAId_userBId: request.senderId < request.receiverId
              ? { userAId: request.senderId, userBId: request.receiverId }
              : { userAId: request.receiverId, userBId: request.senderId }
          },
          update: { status: 'active' },
          create: {
            userAId: request.senderId < request.receiverId ? request.senderId : request.receiverId,
            userBId: request.senderId < request.receiverId ? request.receiverId : request.senderId,
            status: 'active'
          }
        })
      ]);

      return res.json({ message: 'Request accepted successfully', status: 'accepted' });
    } else {
      // Decline request
      await prisma.connectionRequest.update({
        where: { id: requestId },
        data: { status: 'declined' }
      });
      return res.json({ message: 'Request declined successfully', status: 'declined' });
    }
  } catch (error) {
    console.error('Respond to request error:', error);
    return res.status(500).json({ error: 'Internal server error responding to request' });
  }
}

export async function unmatch(req, res) {
  try {
    const { partnerId } = req.body;
    const userId = req.user.id;

    if (!partnerId) {
      return res.status(400).json({ error: 'Partner ID is required' });
    }

    const userAId = userId < partnerId ? userId : partnerId;
    const userBId = userId < partnerId ? partnerId : userId;

    const match = await prisma.match.findUnique({
      where: { userAId_userBId: { userAId, userBId } }
    });

    if (!match || match.status !== 'active') {
      return res.status(404).json({ error: 'Active connection not found' });
    }

    await prisma.match.update({
      where: { userAId_userBId: { userAId, userBId } },
      data: { status: 'unmatched' }
    });

    return res.json({ message: 'Unmatched successfully', status: 'unmatched' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error during unmatch' });
  }
}

export async function getChats(req, res) {
  try {
    const userId = req.user.id;

    // Get matches involving user
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: userId },
          { userBId: userId }
        ]
      },
      include: {
        userA: { select: { id: true, name: true, photoUrl: true, bio: true, isVerified: true } },
        userB: { select: { id: true, name: true, photoUrl: true, bio: true, isVerified: true } }
      }
    });

    // Format chat list
    const chats = matches.map(match => {
      const partner = match.userAId === userId ? match.userB : match.userA;
      return {
        id: match.id,
        status: match.status, // active or unmatched
        partner: {
          id: partner.id,
          name: partner.name,
          photoUrl: partner.photoUrl,
          bio: partner.bio,
          isVerified: partner.isVerified
        },
        createdAt: match.createdAt
      };
    });

    return res.json(chats);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error fetching chats' });
  }
}

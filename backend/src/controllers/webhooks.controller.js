import prisma from '../db.js';

export async function chatGate(req, res) {
  try {
    const { senderId, receiverId, channelId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ allowed: false, error: 'Sender ID and Receiver ID are required' });
    }

    const userAId = senderId < receiverId ? senderId : receiverId;
    const userBId = senderId < receiverId ? receiverId : senderId;

    // Verify active match exists between sender and receiver
    const match = await prisma.match.findUnique({
      where: {
        userAId_userBId: { userAId, userBId }
      }
    });

    if (!match || match.status !== 'active') {
      return res.status(403).json({
        allowed: false,
        error: 'Forbidden: No active connection exists between these users'
      });
    }

    // Consent gate passed
    return res.json({ allowed: true, channelId });
  } catch (error) {
    console.error('Chat gate error:', error);
    return res.status(500).json({ allowed: false, error: 'Internal server error in chat consent gate' });
  }
}

export async function callGate(req, res) {
  try {
    const { senderId, receiverId, callType = 'video' } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ allowed: false, error: 'Sender ID and Receiver ID are required' });
    }

    const userAId = senderId < receiverId ? senderId : receiverId;
    const userBId = senderId < receiverId ? receiverId : senderId;

    // Verify active match exists
    const match = await prisma.match.findUnique({
      where: {
        userAId_userBId: { userAId, userBId }
      }
    });

    if (!match || match.status !== 'active') {
      return res.status(403).json({
        allowed: false,
        error: 'Forbidden: Cannot call without an active connection'
      });
    }

    // Generate room name securely (hash or UUID based on match ID)
    const roomName = `room_${match.id}`;

    // Here we could sign a Jitsi JWT if JWT verification is enabled on Jitsi,
    // otherwise return the open-source room details for the Jitsi Meet iframe/SDK.
    return res.json({
      allowed: true,
      roomName,
      jitsiServer: 'https://meet.jit.si', // Default open source Jitsi server
      jwt: null // Optional: signed token if needed
    });
  } catch (error) {
    console.error('Call gate error:', error);
    return res.status(500).json({ allowed: false, error: 'Internal server error in call gate' });
  }
}

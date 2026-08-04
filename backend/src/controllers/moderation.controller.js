import prisma from '../db.js';

export async function blockUser(req, res) {
  try {
    const { targetId } = req.body;
    const userId = req.user.id;

    if (!targetId) {
      return res.status(400).json({ error: 'Target user ID is required' });
    }

    if (userId === targetId) {
      return res.status(400).json({ error: 'You cannot block yourself' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    await executeBlock(userId, targetId, 'BLOCK', 'User blocked unilaterally');

    return res.json({ message: 'User blocked successfully' });
  } catch (error) {
    console.error('Block user error:', error);
    return res.status(500).json({ error: 'Internal server error blocking user' });
  }
}

export async function reportUser(req, res) {
  try {
    const { targetId, reason, details } = req.body;
    const userId = req.user.id;

    if (!targetId || !reason) {
      return res.status(400).json({ error: 'Target user ID and reason are required' });
    }

    if (userId === targetId) {
      return res.status(400).json({ error: 'You cannot report yourself' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    // 1. Execute block (reports always trigger a block to protect reporter)
    await executeBlock(userId, targetId, `REPORT: ${reason}`, details);

    // 2. Count total reports against the target user to check for auto-suspension
    const reportCount = await prisma.report.count({
      where: {
        reportedId: targetId,
        reason: { startsWith: 'REPORT:' }
      }
    });

    // Auto-suspend visibility if 3+ reports
    if (reportCount >= 3) {
      await prisma.user.update({
        where: { id: targetId },
        data: { visibility: false }
      });
      // ponytail: auto-suspension warning comment
      // console.log(`User ${targetId} auto-suspended due to ${reportCount} reports`);
    }

    return res.json({ message: 'User reported and blocked successfully' });
  } catch (error) {
    console.error('Report user error:', error);
    return res.status(500).json({ error: 'Internal server error reporting user' });
  }
}

// Helper to run block updates atomically
async function executeBlock(userId, targetId, reason, details) {
  const userAId = userId < targetId ? userId : targetId;
  const userBId = userId < targetId ? targetId : userId;

  await prisma.$transaction([
    // Log the block/report
    prisma.report.create({
      data: {
        reporterId: userId,
        reportedId: targetId,
        reason,
        details,
        status: 'pending'
      }
    }),
    // Invalidate active matches
    prisma.match.updateMany({
      where: {
        userAId,
        userBId,
        status: 'active'
      },
      data: { status: 'unmatched' }
    }),
    // Decline all pending connection requests in both directions
    prisma.connectionRequest.updateMany({
      where: {
        OR: [
          { senderId: userId, receiverId: targetId, status: 'pending' },
          { senderId: targetId, receiverId: userId, status: 'pending' }
        ]
      },
      data: { status: 'declined' }
    })
  ]);
}

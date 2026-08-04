import prisma from '../db.js';

export async function createPost(req, res) {
  try {
    const { mediaUrls, caption, visibility } = req.body;
    const userId = req.user.id;

    if (!mediaUrls || !Array.isArray(mediaUrls) || mediaUrls.length === 0) {
      return res.status(400).json({ error: 'At least one media URL is required' });
    }

    if (!visibility || !['public', 'connections'].includes(visibility)) {
      return res.status(400).json({ error: 'Visibility must be public or connections' });
    }

    const post = await prisma.post.create({
      data: {
        userId,
        mediaUrls: JSON.stringify(mediaUrls),
        caption,
        visibility
      }
    });

    return res.json({
      ...post,
      mediaUrls: JSON.parse(post.mediaUrls)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error creating post' });
  }
}

export async function getFeed(req, res) {
  try {
    const userId = req.user.id;

    // Get list of blocked user IDs
    const blocks = await prisma.report.findMany({
      where: {
        OR: [
          { reporterId: userId, reason: 'BLOCK' },
          { reportedId: userId, reason: 'BLOCK' }
        ]
      }
    });
    const blockedIds = blocks.map(b => b.reporterId === userId ? b.reportedId : b.reporterId);

    // Get all posts from non-blocked users
    const allPosts = await prisma.post.findMany({
      where: {
        userId: { notIn: blockedIds }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            photoUrl: true,
            isVerified: true
          }
        },
        likes: {
          where: { userId }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get active matches to resolve private/connections visibility
    const activeMatches = await prisma.match.findMany({
      where: {
        status: 'active',
        OR: [
          { userAId: userId },
          { userBId: userId }
        ]
      }
    });
    const connectedUserIds = activeMatches.map(m => m.userAId === userId ? m.userBId : m.userAId);

    // Filter feed items server-side based on visibility rules
    const filteredFeed = allPosts.filter(post => {
      // 1. Own posts are always visible
      if (post.userId === userId) return true;

      // 2. Public posts are visible
      if (post.visibility === 'public') return true;

      // 3. Connections-only posts require active Match status
      if (post.visibility === 'connections') {
        return connectedUserIds.includes(post.userId);
      }

      return false;
    });

    // Format response
    const formattedFeed = filteredFeed.map(post => ({
      id: post.id,
      mediaUrls: JSON.parse(post.mediaUrls),
      caption: post.caption,
      visibility: post.visibility,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt,
      author: post.user,
      isLiked: post.likes.length > 0
    }));

    return res.json(formattedFeed);
  } catch (error) {
    console.error('Fetch feed error:', error);
    return res.status(500).json({ error: 'Internal server error fetching feed' });
  }
}

export async function toggleLike(req, res) {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId }
      }
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.like.delete({
          where: {
            postId_userId: { postId, userId }
          }
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { decrement: 1 } }
        })
      ]);
      return res.json({ liked: false });
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({
          data: { postId, userId }
        }),
        prisma.post.update({
          where: { id: postId },
          data: { likeCount: { increment: 1 } }
        })
      ]);
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like toggle error:', error);
    return res.status(500).json({ error: 'Internal server error toggling like' });
  }
}

export async function addComment(req, res) {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const [comment] = await prisma.$transaction([
      prisma.comment.create({
        data: { postId, userId, text }
      }),
      prisma.post.update({
        where: { id: postId },
        data: { commentCount: { increment: 1 } }
      })
    ]);

    return res.json(comment);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error adding comment' });
  }
}

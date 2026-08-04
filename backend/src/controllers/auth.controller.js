import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-key-change-in-production';

// Helper to generate access and refresh tokens
function generateTokens(userId, email, sessionId) {
  const accessToken = jwt.sign({ userId, email, sessionId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId, sessionId }, JWT_REFRESH_SECRET, { expiresIn: '30d' });
  return { accessToken, refreshToken };
}

export async function googleLogin(req, res) {
  try {
    const { email, name, photoUrl, dob, phone, deviceId = 'unknown-device' } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Missing email or name' });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Calculate age from dob if provided, default to a date if empty
      const birthDate = dob ? new Date(dob) : new Date(new Date().setFullYear(new Date().getFullYear() - 25));
      
      // Ensure age is above 18 (basic PRD check)
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        return res.status(400).json({ error: 'User must be 18 years or older' });
      }

      user = await prisma.user.create({
        data: {
          email,
          name,
          dob: birthDate,
          photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
          bio: 'Newly joined Social Connector user!',
          interests: JSON.stringify(['Coffee', 'Travel']),
          phone,
          visibility: false,
          isVerified: false
        }
      });
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        deviceId,
        refreshTokenHash: '', // Set below once generated
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    const { accessToken, refreshToken } = generateTokens(user.id, user.email, session.id);
    const refreshTokenHash = await bcryptjs.hash(refreshToken, 10);

    // Update session with refresh token hash
    await prisma.session.update({
      where: { id: session.id },
      data: { refreshTokenHash }
    });

    return res.json({
      accessToken,
      refreshToken,
      user: {
        ...user,
        interests: JSON.parse(user.interests)
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId }
    });

    if (!session || session.revokedAt) {
      return res.status(401).json({ error: 'Session has been revoked' });
    }

    const isMatch = await bcryptjs.compare(refreshToken, session.refreshTokenHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id, user.email, session.id);

    // Optional: Rotate refresh token for security
    const newRefreshTokenHash = await bcryptjs.hash(tokens.refreshToken, 10);
    await prisma.session.update({
      where: { id: session.id },
      data: {
        refreshTokenHash: newRefreshTokenHash,
        lastActiveAt: new Date()
      }
    });

    return res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        ...user,
        interests: JSON.parse(user.interests)
      }
    });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
}

export async function logout(req, res) {
  try {
    const { sessionId } = req.user;
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() }
    });
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error during logout' });
  }
}

import prisma from '../db.js';

export async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({
      ...user,
      interests: JSON.parse(user.interests)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error fetching profile' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, bio, interests, radius, readReceipts, vacationMode, phone } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (interests !== undefined) updateData.interests = JSON.stringify(interests);
    if (radius !== undefined) updateData.radius = radius;
    if (readReceipts !== undefined) updateData.readReceipts = readReceipts;
    if (phone !== undefined) updateData.phone = phone;

    if (vacationMode !== undefined) {
      updateData.vacationMode = vacationMode;
      // vacation mode turns off visibility automatically
      if (vacationMode === true) {
        updateData.visibility = false;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });

    return res.json({
      ...updatedUser,
      interests: JSON.parse(updatedUser.interests)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error updating profile' });
  }
}

export async function toggleVisibility(req, res) {
  try {
    const { visibility } = req.body;
    if (visibility === undefined) {
      return res.status(400).json({ error: 'Visibility boolean is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (visibility && !user.isVerified) {
      return res.status(400).json({ error: 'Cannot set visibility to ON without photo verification' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { visibility }
    });

    return res.json({
      message: `Visibility set to ${visibility ? 'ON' : 'OFF'}`,
      visibility: updatedUser.visibility
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error toggling visibility' });
  }
}

export async function verifyPhoto(req, res) {
  try {
    // Stub photo verification - mock 3rd party API response
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        isVerified: true,
        visibility: true // automatically opt in after verification
      }
    });

    return res.json({
      message: 'Photo verification successful',
      isVerified: updatedUser.isVerified,
      visibility: updatedUser.visibility
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error during photo verification' });
  }
}

export async function getPermissions(req, res) {
  try {
    const permissions = await prisma.permission.findMany({
      where: { userId: req.user.id }
    });
    return res.json(permissions);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error fetching permissions' });
  }
}

export async function updatePermission(req, res) {
  try {
    const { permissionType, granted } = req.body;
    if (!permissionType || granted === undefined) {
      return res.status(400).json({ error: 'permissionType and granted are required' });
    }

    const permission = await prisma.permission.upsert({
      where: {
        userId_permissionType: {
          userId: req.user.id,
          permissionType
        }
      },
      update: { granted },
      create: {
        userId: req.user.id,
        permissionType,
        granted
      }
    });

    return res.json(permission);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error updating permission' });
  }
}

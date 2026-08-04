import geohash from 'ngeohash';
import prisma from '../db.js';

export async function updateLocation(req, res) {
  try {
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Check user visibility
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.visibility) {
      return res.status(403).json({ error: 'Location updates rejected: visibility is OFF' });
    }

    // Encode to 6-character geohash (~1.2km x 0.6km grid cell)
    const coarseGeohash = geohash.encode(latitude, longitude, 6);

    // Save only coarse geohash, do not persist exact coordinates
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        geohash: coarseGeohash,
        locationUpdatedAt: new Date(),
        // We ensure exact coordinates are NEVER saved
        latitude: null,
        longitude: null
      }
    });

    return res.json({
      message: 'Coarse location updated successfully',
      geohash: coarseGeohash
    });
  } catch (error) {
    console.error('Location update error:', error);
    return res.status(500).json({ error: 'Internal server error updating location' });
  }
}

export async function getNearby(req, res) {
  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!currentUser.visibility || !currentUser.geohash) {
      return res.json([]); // Return empty list if current user is invisible or has no location
    }

    // Get list of blocked user IDs to filter them out
    const blocks = await prisma.report.findMany({
      where: {
        OR: [
          { reporterId: currentUser.id, reason: 'BLOCK' },
          { reportedId: currentUser.id, reason: 'BLOCK' }
        ]
      }
    });
    const blockedIds = blocks.map(b => b.reporterId === currentUser.id ? b.reportedId : b.reporterId);

    // Calculate geohash neighbors (9 cells total: center + 8 neighbors)
    const centerGeohash = currentUser.geohash;
    const neighbors = geohash.neighbors(centerGeohash);
    const geohashGroup = [centerGeohash, ...neighbors];

    // Find verified visible users in these geohash cells
    const rawNearbyUsers = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id, notIn: blockedIds },
        visibility: true,
        isVerified: true,
        vacationMode: false,
        geohash: { in: geohashGroup }
      }
    });

    // Format results with distance bands (no exact distance returned)
    const nearbyList = rawNearbyUsers.map(user => {
      const isSameCell = user.geohash === centerGeohash;
      
      return {
        id: user.id,
        name: user.name,
        photoUrl: user.photoUrl,
        bio: user.bio,
        interests: JSON.parse(user.interests),
        // Distance bands: "within 1 km" for same cell, "within 3 km" for neighbors
        distanceBand: isSameCell ? 'Within 1 km' : 'Within 3 km',
        activeNow: user.locationUpdatedAt && (new Date() - new Date(user.locationUpdatedAt) < 15 * 60 * 1000) // Active in last 15 mins
      };
    });

    // Optional query filters
    const { verifiedOnly, activeNowOnly, interest } = req.query;
    let filteredList = nearbyList;

    if (verifiedOnly === 'true') {
      // Already filtered in database query above (isVerified: true), but keeping here for client consistency
    }
    if (activeNowOnly === 'true') {
      filteredList = filteredList.filter(u => u.activeNow);
    }
    if (interest) {
      filteredList = filteredList.filter(u => u.interests.includes(interest));
    }

    return res.json(filteredList);
  } catch (error) {
    console.error('Fetch nearby error:', error);
    return res.status(500).json({ error: 'Internal server error fetching nearby users' });
  }
}

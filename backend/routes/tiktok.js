const express = require('express');
const router = express.Router();
const { db } = require('../firebase-config');
const { collection, addDoc } = require('firebase/firestore');

// ===== SEARCH TIKTOK FOR TRENDING SPOTS (MOCK DATA) =====
router.get('/search', async (req, res) => {
  try {
    const { query: searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query required' });
    }

    console.log(`🔍 Searching for trending spots in: "${searchQuery}"`);

    // Mock TikTok data
    const mockSpots = [
      {
        Name: `Trendy Cafe in ${searchQuery}`,
        Category: 'Cafe',
        Location: searchQuery,
        Description: 'Aesthetic vibes, great coffee, perfect for photos',
        ImageUrl: 'https://via.placeholder.com/400x300?text=Trendy+Cafe',
        Rating: '4.8',
        source: 'tiktok',
        createdAt: new Date(),
        likes: 15000,
      },
      {
        Name: `Hidden Gem Restaurant`,
        Category: 'Restaurant',
        Location: searchQuery,
        Description: 'Must-visit spot with viral dishes',
        ImageUrl: 'https://via.placeholder.com/400x300?text=Restaurant',
        Rating: '4.9',
        source: 'tiktok',
        createdAt: new Date(),
        likes: 25000,
      },
      {
        Name: `Scenic Viewpoint`,
        Category: 'Viewpoint',
        Location: searchQuery,
        Description: 'Instagram-worthy views that are trending',
        ImageUrl: 'https://via.placeholder.com/400x300?text=Viewpoint',
        Rating: '4.7',
        source: 'tiktok',
        createdAt: new Date(),
        likes: 18000,
      },
    ];

    // Save to Firestore
    for (const spot of mockSpots) {
      try {
        await addDoc(collection(db, 'Places'), spot);
        console.log(`✅ Saved: ${spot.Name}`);
      } catch (error) {
        console.error(`Error saving spot: ${spot.Name}`, error);
      }
    }

    res.json({
      message: `Found ${mockSpots.length} trending spots in ${searchQuery}`,
      spots: mockSpots,
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      error: 'Failed to search spots',
      details: error.message,
    });
  }
});

module.exports = router;
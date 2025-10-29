const express = require('express');
const axios = require('axios');
const router = express.Router();
const { db } = require('../firebase-config');
const { collection, addDoc, query, where, getDocs } = require('firebase/firestore');

// ===== SEARCH TIKTOK FOR TRENDING SPOTS =====
router.get('/search', async (req, res) => {
  try {
    const { query: searchQuery } = req.query;

    if (!searchQuery) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;

    if (!clientKey || !clientSecret) {
      return res.status(500).json({ error: 'TikTok credentials not configured' });
    }

    console.log(`🔍 Searching TikTok for: "${searchQuery}"`);

    // Call TikTok API
    const tiktokResponse = await axios.get(
      'https://open.tiktokapis.com/v1/video/query/',
      {
        headers: {
          Authorization: `Bearer ${clientKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          query: searchQuery,
          max_count: 10,
        },
      }
    );

    const videos = tiktokResponse.data.data || [];
    console.log(`✅ Found ${videos.length} TikTok videos`);

    const spots = videos.map(video => ({
      Name: video.title || searchQuery,
      Category: 'TikTok Trend',
      Location: searchQuery,
      Description: video.desc || 'Trending on TikTok',
      ImageUrl: video.dynamic_cover || '',
      Rating: 'Popular',
      source: 'tiktok',
      createdAt: new Date(),
      likes: video.like_count || 0,
    }));

    res.json({
      message: `Found ${spots.length} spots from TikTok`,
      spots: spots,
    });
  } catch (error) {
    console.error('❌ TikTok API Error:', error.message);
    res.status(500).json({
      error: 'Failed to search TikTok',
      details: error.message,
    });
  }
});

module.exports = router;
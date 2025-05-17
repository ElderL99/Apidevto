const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Crear un post
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const post = new Post({ title, content, author });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Obtener un post por ID

// Últimos posts
router.get('/latest', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Posts relevantes
router.get('/relevant', async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments'
        }
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' }
        }
      },
      { $sort: { commentCount: -1 } }
    ]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router; 
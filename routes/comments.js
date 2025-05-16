const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Crear comentario
router.post('/', async (req, res) => {
  try {
    const { content, author, post } = req.body;
    const comment = new Comment({ content, author, post });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener comentarios de un post
router.get('/', async (req, res) => {
  try {
    const { post } = req.query;
    const comments = await Comment.find({ post }).populate('author', 'username');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
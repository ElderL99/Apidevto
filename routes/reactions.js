const express = require('express');
const router = express.Router();
const Reaction = require('../models/Reaction');

// Toggle de reacción
router.post('/toggle', async (req, res) => {
  try {
    const { type, user, post } = req.body;

    // Buscar si ya existe la reacción
    const existingReaction = await Reaction.findOne({ type, user, post });

    if (existingReaction) {
      await Reaction.deleteOne({ _id: existingReaction._id });
      const total = await Reaction.countDocuments({ post });
      res.json({ action: 'removed', total });
    } else {
      const reaction = new Reaction({ type, user, post });
      await reaction.save();
      const total = await Reaction.countDocuments({ post });
      res.json({ action: 'added', total });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener reacciones de un post
router.get('/', async (req, res) => {
  try {
    const { post } = req.query;
    const reactions = await Reaction.find({ post }).populate('user', 'username');
    res.json(reactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
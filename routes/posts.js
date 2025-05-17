const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

// Crear un post
router.post("/", async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validar campos requeridos
    if (!title || !content) {
      return res.status(400).json({ error: "Faltan campos obligatorios: title o content" });
    }

    // Obtener el ID del usuario desde el token JWT
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const author = decoded.id;

    // Crear el post
    const post = new Post({ title, content, author, tags });
    await post.save();
    res.status(201).json(post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener posts por tag
router.get('/by-tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    if (!tag) return res.status(400).json({ error: "Falta el tag" });

    const posts = await Post.find({ tags: tag }).populate("author", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los tags existentes
router.get("/tags", async (req, res) => {
  try {
    const tags = await Post.distinct("tags");
    res.json(tags);
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

// Obtener resumen de reacciones de un post
router.get('/:id/reactions', async (req, res) => {
  try {
    const postId = req.params.id;

    // Validar ID del post
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "ID de post inválido" });
    }

    const reactions = await Post.getReactionsSummary(postId);
    res.json(reactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
        $lookup: {
          from: 'reactions',
          localField: '_id',
          foreignField: 'post',
          as: 'reactions'
        }
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
          reactionCount: { $size: '$reactions' },
          relevance: {
            $add: [
              { $multiply: ['$commentCount', 2] },
              '$reactionCount'
            ]
          }
        }
      },
      { $sort: { relevance: -1 } }
    ]);

    // Opcional: Populate para obtener datos del autor
    const populatedPosts = await Post.populate(posts, { path: 'author', select: 'username' });
    res.json(populatedPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscarposts por título, contenido, tags o autor
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || ""; // Ejemplo: /api/posts/search?q=nodejs
    if (!query) return res.status(400).json({ error: "Falta el parámetro de búsqueda" });

    // Buscar posts que coincidan con el query
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "users", // Colección de usuarios
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" }, // Convierte el array "author" en un objeto
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: "i" } }, // Búsqueda en título (case-insensitive)
            { content: { $regex: query, $options: "i" } }, // Búsqueda en contenido
            { tags: { $regex: query, $options: "i" } }, // Búsqueda en tags
            { "author.username": { $regex: query, $options: "i" } }, // Búsqueda en nombre de usuario
          ]
        }
      },
      {
        $project: {
          title: 1,
          content: 1,
          tags: 1,
          createdAt: 1,
          "author.username": 1
        }
      }
    ]);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
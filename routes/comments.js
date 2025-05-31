const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const jwt = require("jsonwebtoken");

// Crea comentarios (protegido por JWT)
router.post('/', async (req, res) => {
  try {
    const { post, content } = req.body; // <-- author ya NO se recibe del body

    // Valida  campos requeridos
    if (!post || !content) {
      return res.status(400).json({ error: "Faltan campos obligatorios: post o content" });
    }

    // Extrae y verificar el token JWT
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const author = decoded.id; // <-- ID del usuario autenticado

    // Crea el comentario
    const comment = new Comment({ post, content, author });
    await comment.save();

    // Populate para mostrar datos del autor en la respuesta
    await comment.populate("author", "username");

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    
    // Maneja errores específicos de JWT 
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }

    res.status(500).json({ error: error.message });
  }
});

// Obtiene comentarios de un post (sin cambios)
router.get('/', async (req, res) => {
  try {
    const { post, limit } = req.query
    let query = Comment.find({ post })
      .populate('author', 'username')
      .sort({ createdAt: -1 })       // los más nuevos primero

    if (limit) query = query.limit(Number(limit))

    const comments = await query.exec()
    res.json(comments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})  
module.exports = router;
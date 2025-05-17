// routes/reactions.js
const express = require("express");
const router = express.Router();
const Reaction = require("../models/Reaction");
const jwt = require("jsonwebtoken");

router.post("/toggle", async (req, res) => {
  try {
    const { post, type } = req.body;

    // Validar campos
    if (!post || !type) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Obtener el usuario desde el token JWT
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = decoded.id; // <-- ¡Aquí se obtiene el user!

    // Buscar reacción existente
    const existingReaction = await Reaction.findOne({ post, user, type });

    if (existingReaction) {
      await Reaction.deleteOne({ _id: existingReaction._id });
      const total = await Reaction.countDocuments({ post, type });
      res.json({ action: "removed", total });
    } else {
      const reaction = new Reaction({ post, user, type }); // <-- Incluir user
      await reaction.save();
      const total = await Reaction.countDocuments({ post, type });
      res.json({ action: "added", total });
    }

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
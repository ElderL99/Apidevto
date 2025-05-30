// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'El usuario ya existe' });

    // Crear nuevo usuario
    user = new User({ username, email, password });
    await user.save();

    // Generar JWT con id y username
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver token y username
    res.status(201).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Generar JWT con id y username
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Devolver token y username
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../public', 'uploads')));

// Conexión a MongoDB (patrón singleton para serverless)
async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI);
}
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    next(err);
  }
});

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando en Vercel!');
});

// Rutas principales (igual que en tu server.js)
app.use('/api/auth', require('../routes/auth'));
app.use('/api/posts', require('../routes/posts'));
app.use('/api/comments', require('../routes/comments'));
app.use('/api/reactions', require('../routes/reactions'));

module.exports = serverless(app);

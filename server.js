
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión:', err))

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor funcionando!')
})

// Rutas
app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))
app.use('/api/comments', require('./routes/comments'))
app.use('/api/reactions', require('./routes/reactions'))


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`)
})



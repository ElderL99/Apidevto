// middleware/auth.js
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or malformed' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Adjuntar información del usuario a la solicitud
    req.user = { id: decoded.id, username: decoded.username }
    next()
  } catch (err) {
    console.error('JWT verification failed:', err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

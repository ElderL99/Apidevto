// routes/reactions.js
const express = require('express')
const jwt = require('jsonwebtoken')
const Reaction = require('../models/Reaction')
const { EMOJIS } = require('../models/Reaction')
const mongoose = require('mongoose')

const router = express.Router()

/* helper: hallar user desde header */
function getUserIdFromReq(req) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) throw new Error('NO_TOKEN')
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  return decoded.id
}

/*   Toggle   POST /api/reactions/toggle */
router.post('/toggle', async (req, res) => {
  try {
    const { post, type } = req.body
    if (!post || !type || !EMOJIS.includes(type))
      return res.status(400).json({ error: 'Campos inválidos' })

    const user = getUserIdFromReq(req)

    const existing = await Reaction.findOne({ post, user, type })
    if (existing) {
      await existing.deleteOne()
      const total = await Reaction.countDocuments({ post, type })
      return res.json({ action: 'removed', total })
    } else {
      await Reaction.create({ post, user, type })
      const total = await Reaction.countDocuments({ post, type })
      return res.json({ action: 'added', total })
    }
  } catch (err) {
    if (err.message === 'NO_TOKEN' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' })
    }
    return res.status(500).json({ error: err.message })
  }
})


router.get('/summary/:postId', async (req, res) => {
  try {
    const { postId } = req.params

    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ error: 'postId inválido' })
    }

    const agg = await Reaction.aggregate([
      { $match: { post: new mongoose.Types.ObjectId(postId) } },
      { $group: { _id: '$type', total: { $sum: 1 } } },
    ])

    const summary = EMOJIS.reduce((acc, t) => ({ ...acc, [t]: 0 }), {})
    agg.forEach(({ _id, total }) => (summary[_id] = total))

    let userReacted = []
    try {
      const user = getUserIdFromReq(req)
      const reacts = await Reaction.find({ post: postId, user })
      userReacted = reacts.map((r) => r.type)
    } catch (_) {}

    res.json({ summary, userReacted })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router

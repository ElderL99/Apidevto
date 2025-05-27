// routes/posts.js
const express  = require('express')
const router   = express.Router()
const Post     = require('../models/Post')
const jwt      = require('jsonwebtoken')
const mongoose = require('mongoose')

/**
 * 1) Crear un post (protegido por JWT)
 */
router.post('/', async (req, res) => {
  try {
    const { title, content, tags } = req.body
    if (!title || !content) {
      return res
        .status(400)
        .json({ error: 'Faltan campos obligatorios: title o content' })
    }
    const token   = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const author  = decoded.id

    const post = new Post({ title, content, author, tags })
    await post.save()
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 2) Posts por tag
 */
router.get('/by-tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params
    if (!tag) return res.status(400).json({ error: 'Falta el tag' })
    const posts = await Post.find({ tags: tag }).populate('author','username')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 3) Todos los tags
 */
router.get('/tags', async (req, res) => {
  try {
    const tags = await Post.distinct('tags')
    res.json(tags)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 4) Últimos posts
 */
router.get('/latest', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author','username')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 5) Posts relevantes
 */
router.get('/relevant', async (req, res) => {
  try {
    const posts = await Post.aggregate([
      { $lookup: { from:'comments', localField:'_id', foreignField:'post', as:'comments' } },
      { $lookup: { from:'reactions', localField:'_id', foreignField:'post', as:'reactions' } },
      { $addFields: {
          commentCount:  { $size:'$comments' },
          reactionCount: { $size:'$reactions' },
          relevance:     { $add: [
            { $multiply:['$commentCount',2] },
            '$reactionCount'
          ]}
        }
      },
      { $sort:{ relevance:-1 } }
    ])
    const populated = await Post.populate(posts, { path:'author', select:'username' })
    res.json(populated)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 6) Buscar posts
 */
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || ''
    if (!q) return res.status(400).json({ error:'Falta el parámetro de búsqueda' })

    const posts = await Post.aggregate([
      { $lookup:{ from:'users', localField:'author', foreignField:'_id', as:'author' }},
      { $unwind:'$author' },
      { $match:{
          $or:[
            { title:          { $regex:q, $options:'i' } },
            { content:        { $regex:q, $options:'i' } },
            { tags:           { $regex:q, $options:'i' } },
            { 'author.username': { $regex:q, $options:'i' }}
          ]
        }
      },
      { $project:{ title:1,content:1,tags:1,createdAt:1,'author.username':1 }}
    ])
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 7) Todos los posts
 */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author','username')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 8) Reacciones de un post
 */
router.get('/:id/reactions', async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error:'ID de post inválido' })
    }
    const reactions = await Post.getReactionsSummary(id)
    res.json(reactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

/**
 * 9) UN SOLO POST POR ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id).populate('author','username')
    if (!post) {
      return res.status(404).json({ error:'Post no encontrado' })
    }
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router

// routes/posts.js
const express  = require('express')
const router   = express.Router()
const path     = require('path')
const multer   = require('multer')
const mongoose = require('mongoose')
const Post     = require('../models/Post')
const auth     = require('../middleware/auth') // JWT auth middleware


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'))
  },
  filename: (req, file, cb) => {
    const uniq = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext  = path.extname(file.originalname)
    cb(null, uniq + ext)
  }
})
const upload = multer({ storage })




router.post(
  '/',
  auth,
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, content, tags } = req.body
      if (!title || !content) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: title o content' })
      }
      // 
      const tagsArray = tags
        ? tags.split(',')
            .map(t => t.toLowerCase().trim())
            .filter(Boolean)
        : []
      
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined
      const newPost = new Post({
        title,
        content,
        tags: tagsArray,
        author: req.user.id,
        image: imageUrl,
      })
      await newPost.save()
      res.status(201).json(newPost)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: error.message })
    }
  }
)


router.get('/by-tag/:tag', async (req, res) => {
  try {
    const { tag } = req.params
    if (!tag) return res.status(400).json({ error: 'Falta el tag' })
    const posts = await Post.find({ tags: tag }).populate('author', 'username')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/tags', async (req, res) => {
  try {
    const tags = await Post.distinct('tags')
    res.json(tags)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.get('/latest', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'username')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.get('/relevant', async (req, res) => {
  try {
    const posts = await Post.aggregate([
      { $lookup: { from: 'comments', localField: '_id', foreignField: 'post', as: 'comments' } },
      { $lookup: { from: 'reactions', localField: '_id', foreignField: 'post', as: 'reactions' } },
      { $addFields: {
          commentCount:  { $size: '$comments' },
          reactionCount: { $size: '$reactions' },
          relevance:     { $add: [ { $multiply: ['$commentCount', 2] }, '$reactionCount' ] }
        }
      },
      { $sort: { relevance: -1 } }
    ])
    const populated = await Post.populate(posts, { path: 'author', select: 'username' })
    res.json(populated)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || ''
    if (!q) return res.status(400).json({ error: 'Falta el parámetro de búsqueda' })
    const posts = await Post.aggregate([
      { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'author' } },
      { $unwind: '$author' },
      { $match: {
          $or: [
            { title:           { $regex: q, $options: 'i' } },
            { content:         { $regex: q, $options: 'i' } },
            { tags:            { $regex: q, $options: 'i' } },
            { 'author.username': { $regex: q, $options: 'i' } },
          ]
        }
      },
      { $project: { title:1, content:1, tags:1, createdAt:1, 'author.username':1 } }
    ])
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username')
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.get('/:id/reactions', async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID de post inválido' })
    }
    const reactions = await Post.getReactionsSummary(id)
    res.json(reactions)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.get('/trending', async (req, res) => {
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
        $addFields: {
          commentCount: { $size: '$comments' }
        }
      },
      { $sort: { commentCount: -1, createdAt: -1 } },
      { $limit: 10 }              
    ])
    // Poblamos el autor
    const populated = await Post.populate(posts, {
      path: 'author',
      select: 'username'
    })
    res.json(populated)
  } catch (error) {
    console.error('Error en /posts/trending:', error)
    res.status(500).json({ error: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id).populate('author', 'username')
    if (!post) {
      return res.status(404).json({ error: 'Post no encontrado' })
    }
    res.json(post)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router

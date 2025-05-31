// models/Reaction.js
const mongoose = require('mongoose')


const EMOJIS = ['heart', 'unicorn', 'mind_blown', 'raised_hands', 'fire']

const reactionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: EMOJIS },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

/* Evitar duplicados por usuario+post+tipo */
reactionSchema.index({ post: 1, user: 1, type: 1 }, { unique: true })

module.exports = mongoose.model('Reaction', reactionSchema)
module.exports.EMOJIS = EMOJIS

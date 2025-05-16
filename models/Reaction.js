const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['like', 'heart', 'fire'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reaction', reactionSchema);
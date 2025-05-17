const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: { type: [String], default: [] }, // <-- Nuevo campo "tags"
  createdAt: { type: Date, default: Date.now },
});


postSchema.virtual('reactions', {
  ref: 'Reaction',          // Modelo relacionado
  localField: '_id',        // Campo en Post
  foreignField: 'post',     // Campo en Reaction
});



postSchema.statics.getReactionsSummary = async function (postId) {
  return this.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(postId)
      }
    },
    {
      $lookup: {
        from: "reactions",
        localField: "_id",
        foreignField: "post",
        as: "reactionsList"
      }
    },
    { $unwind: "$reactionsList" },
    {
      $group: {
        _id: "$reactionsList.type",
        count: { $sum: 1 }
      }
    }
  ]);
};

postSchema.pre("save", function (next) {
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags
      .map((tag) => tag.toLowerCase().trim())
      .filter((tag) => tag !== "");
    this.tags = [...new Set(this.tags)];
  }
  next();
});

module.exports = mongoose.model('Post', postSchema); 
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: { type: [String], default: [] }, // <-- Nuevo campo "tags"
  createdAt: { type: Date, default: Date.now },
});

postSchema.pre("save", function (next) {
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags
      .map((tag) => tag.toLowerCase().trim()) // Normaliza cada tag
      .filter((tag) => tag !== ""); // Elimina tags vacíos
    this.tags = [...new Set(this.tags)]; // Elimina duplicados
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
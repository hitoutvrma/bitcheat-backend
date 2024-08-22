const mongoose = require('mongoose');

const feedbackPostSchema = new mongoose.Schema({
  username: String,
  feedback: String,
  createdAt: { type: Date, default: Date.now }
});

const FeedbackPost = mongoose.model('FeedbackPost', feedbackPostSchema);

module.exports = FeedbackPost;
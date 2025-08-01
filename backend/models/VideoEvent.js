
const mongoose = require('mongoose');

const videoEventSchema = new mongoose.Schema({
  eventType: String,
  videoUrl: String,
  timestamp: Date,
  status: String,
  alertId: String,
});

module.exports = mongoose.model('VideoEvent', videoEventSchema);

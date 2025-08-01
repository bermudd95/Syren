
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: String,
  timestamp: Date,
  location: String,
  description: String,
});

module.exports = mongoose.model('Alert', alertSchema);

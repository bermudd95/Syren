
const mongoose = require('mongoose');

const dispatchSchema = new mongoose.Schema({
  zone: String,
  contractorId: String,
  timestamp: Date,
  status: String,
});

module.exports = mongoose.model('Dispatch', dispatchSchema);

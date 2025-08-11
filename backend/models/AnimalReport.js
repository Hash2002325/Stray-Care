const mongoose = require('mongoose');
const AnimalReportSchema = new mongoose.Schema({
  image: String,
  description: String,
  location: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('AnimalReport', AnimalReportSchema);

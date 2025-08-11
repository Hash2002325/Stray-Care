const mongoose = require('mongoose');
const VetSchema = new mongoose.Schema({
  name: String,
  contact: String,
  specialization: String,
  availability: String,
  username: String,
  password: String
});
module.exports = mongoose.model('Vet', VetSchema);

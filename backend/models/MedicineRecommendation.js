const mongoose = require('mongoose');
const MedicineRecommendationSchema = new mongoose.Schema({
  animalReportId: { type: mongoose.Schema.Types.ObjectId, ref: 'AnimalReport' },
  vetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vet' },
  medicine: String,
  notes: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('MedicineRecommendation', MedicineRecommendationSchema);

const express = require('express');
const router = express.Router();
const MedicineRecommendation = require('../models/MedicineRecommendation');

// Add medicine recommendation
router.post('/', async (req, res) => {
  const medicine = new MedicineRecommendation(req.body);
  await medicine.save();
  res.json(medicine);
});

// Get all recommendations
router.get('/', async (req, res) => {
  const medicines = await MedicineRecommendation.find().populate('animalReportId');
  // Add description from animalReport
  const medicinesWithDescription = medicines.map(med => ({
    ...med.toObject(),
     animalReportId: med.animalReportId?._id?.toString() || null,
    description: med.animalReportId?.description || ''
  }));
  res.json(medicinesWithDescription);
});

// Update recommendation
router.put('/:id', async (req, res) => {
  const medicine = await MedicineRecommendation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(medicine);
});

// Delete recommendation
router.delete('/:id', async (req, res) => {
  await MedicineRecommendation.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const AnimalReport = require('../models/AnimalReport');
const multer = require('multer');

// // Create report
// router.post('/', async (req, res) => {
//   const report = new AnimalReport(req.body);
//   await report.save();
//   res.json(report);
// });





// Setup Multer storage for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'), // Save to /uploads folder
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname) // Unique filename
});

const upload = multer({ storage });

// Create report (with image)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { description, location } = req.body;
    const image = req.file ? req.file.filename : null;

    const report = new AnimalReport({
      description,
      location,
      image
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error('Error saving report:', err);
    res.status(500).json({ message: 'Failed to save report' });
  }
});


// Get all reports
router.get('/', async (req, res) => {
  const reports = await AnimalReport.find();
  res.json(reports);
});

// Update report
router.put('/:id', async (req, res) => {
  const report = await AnimalReport.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(report);
});

// Delete report
router.delete('/:id', async (req, res) => {
  await AnimalReport.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;

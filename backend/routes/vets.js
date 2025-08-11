const express = require('express');
const router = express.Router();
const Vet = require('../models/Vet');

// Register vet
router.post('/', async (req, res) => {
  const vet = new Vet(req.body);
  await vet.save();
  res.json(vet);
});

// Get all vets
router.get('/', async (req, res) => {
  const vets = await Vet.find();
  res.json(vets);
});
// Vet login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const vet = await Vet.findOne({ username, password });
  if (vet) {
    res.json({ success: true, vet });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password.' });
  }
});

module.exports = router;

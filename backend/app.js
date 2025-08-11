// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const animalReportRoutes = require('./routes/animalReports');
// const vetRoutes = require('./routes/vets');
// const medicineRoutes = require('./routes/medicines');

// const app = express();
// app.use(cors(
//   {
//     origin: '*', // Allow all origins for simplicity, adjust as needed
//     credentials: false
//   }
// ));
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// app.use('/api/animalReports', animalReportRoutes);
// app.use('/api/vets', vetRoutes);
// app.use('/api/medicines', medicineRoutes);
// app.use('/uploads', express.static('uploads'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const animalReportRoutes = require('../routes/animalReports');
const vetRoutes = require('../routes/vets');
const medicineRoutes = require('../routes/medicines');

const app = express();

app.use(cors({ origin: '*', credentials: false }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use('/api/animalReports', animalReportRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/uploads', express.static('uploads'));

// Instead of app.listen(), export app for Vercel
module.exports = app;


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./api/routes');

const app = express();

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn('MONGODB_URI is not defined, running without database connection');
}

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});

module.exports = { app };

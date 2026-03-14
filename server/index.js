require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const connectDB = require('./config/db');
const apiRoutes = require('./api/routes');
const { startScrapingCron } = require('./cronJobs');

const app = express();

if (process.env.MONGODB_URI) {
  connectDB();
  startScrapingCron();
} else {
  console.warn('MONGODB_URI is not defined, running without database connection');
}

app.use(cors());
app.use(compression());
app.use(express.json());

app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build'), { maxAge: '1y', etag: true }));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server běží na portu ${PORT}`);
});

module.exports = { app };

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Check if database is running
app.get('/api/health', async (req, res) => {
  try {
    const pool = require('./db');
    await pool.query('SELECT 1');
    res.json({ status: 'ok', live: true });
  } catch (error) {
    res.status(500).json({ status: 'error', live: false, message: error.message });
  }
});

app.use('/api/queries', require('./routes/queries'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/promotions', require('./routes/promotions'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

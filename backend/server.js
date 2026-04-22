const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Allow requests from local dev, any Vercel preview URL, and the explicit FRONTEND_URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // e.g. https://car-rental-dbms.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman)
    if (!origin) return callback(null, true);
    // Allow any vercel.app subdomain (covers preview deploys too)
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

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
app.use('/api/admin', require('./routes/admin'));
// TEMPORARY: remove after running /api/migrate once
app.use('/api/migrate', require('./routes/migrate'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

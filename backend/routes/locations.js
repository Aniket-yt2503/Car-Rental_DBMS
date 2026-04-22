const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Location');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { street, city, province, postal_code } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO Location (street, city, province, postal_code) VALUES (?,?,?,?)', [street, city, province, postal_code]);
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

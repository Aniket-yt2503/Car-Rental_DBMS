const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all cars with class and location details
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.*, cc.price_per_day, l.city as location_city 
      FROM Car c
      JOIN CarClass cc ON c.class_name = cc.class_name
      JOIN Location l ON c.location_id = l.location_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { license_plate, make, model, year_made, color, class_name, location_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Car (license_plate, make, model, year_made, color, class_name, location_id) VALUES (?,?,?,?,?,?,?)',
      [license_plate, make, model, year_made, color, class_name, location_id]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all employees with join to Manager for title, and Person for details
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, e.category, e.location_id, m.title as manager_title, l.city as location_city
      FROM Employee e
      JOIN Person p ON e.person_id = p.person_id
      JOIN Location l ON e.location_id = l.location_id
      LEFT JOIN Manager m ON e.person_id = m.person_id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');

// Execute 10 specific queries (using views)
const queries = {
  1: { q: 'SELECT * FROM View_Q1', desc: 'Last name of all customers who are currently renting a car' },
  2: { q: 'SELECT * FROM View_Q2', desc: 'Make and color of all cars currently rented out' },
  3: { q: 'SELECT * FROM View_Q3', desc: 'For each completed rental: rental_price and rental_id' },
  4: { q: 'SELECT * FROM View_Q4', desc: 'Last names of all managers' },
  5: { q: 'SELECT * FROM View_Q5', desc: 'Last and first names of all customers' },
  6: { q: 'SELECT * FROM View_Q6', desc: 'Is any employee also a customer?' },
  7: { q: 'SELECT * FROM View_Q7', desc: 'Does our president work at headquarters?' },
  8: { q: 'SELECT * FROM View_Q8', desc: 'rental_id of all shortest (completed) rentals' },
  9: { q: 'SELECT * FROM View_Q9', desc: 'Price of the cheapest completed rental' },
  10: { q: 'SELECT * FROM View_Q10', desc: 'Makes of cars that have never been rented' }
};

router.get('/:id', async (req, res) => {
  const qId = req.params.id;
  if (!queries[qId]) return res.status(404).json({ error: 'Query not found' });
  
  try {
    const [rows] = await pool.query(queries[qId].q);
    res.json({ description: queries[qId].desc, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

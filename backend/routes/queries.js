const express = require('express');
const router = express.Router();
const pool = require('../db');

// Execute 10 specific queries (using views)
const queries = {
  1: { q: 'SELECT * FROM View_Q1', desc: 'Last names of all customers with active rental agreements.' },
  2: { q: 'SELECT * FROM View_Q2', desc: 'Make and color of all vehicles currently rented out.' },
  3: { q: 'SELECT * FROM View_Q3', desc: 'Price and ID for all completed rental transactions.' },
  4: { q: 'SELECT * FROM View_Q4', desc: 'Last names of all personnel in management roles.' },
  5: { q: 'SELECT * FROM View_Q5', desc: 'Full names (Last, First) of all registered customers.' },
  6: { q: 'SELECT * FROM View_Q6', desc: 'Detection of employees who are also registered customers.' },
  7: { q: 'SELECT * FROM View_Q7', desc: 'Verification of President residency at Hamilton HQ.' },
  8: { q: 'SELECT * FROM View_Q8', desc: 'Rental IDs of completed rentals with the shortest duration.' },
  9: { q: 'SELECT * FROM View_Q9', desc: 'Minimum price value among all completed rentals.' },
  10: { q: 'SELECT * FROM View_Q10', desc: 'Makes of cars that have never been assigned a rental.' }
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

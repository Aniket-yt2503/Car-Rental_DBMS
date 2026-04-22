const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.person_id as customer_id 
      FROM Customer c
      JOIN Person p ON c.person_id = p.person_id
    `);
    // Ideally we fetches phone numbers too, but basic details here is fine.
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { first_name, last_name, street, city, province, postal_code, drivers_license, phone_number } = req.body;
  
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const [personRes] = await conn.query(
      'INSERT INTO Person (first_name, last_name, street, city, province, postal_code, drivers_license) VALUES (?,?,?,?,?,?,?)',
      [first_name, last_name, street, city, province, postal_code, drivers_license]
    );
    const personId = personRes.insertId;
    
    if (phone_number) {
      await conn.query('INSERT INTO Phone (person_id, phone_number) VALUES (?,?)', [personId, phone_number]);
    }
    
    await conn.query('INSERT INTO Customer (person_id) VALUES (?)', [personId]);
    await conn.commit();
    res.json({ id: personId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

module.exports = router;

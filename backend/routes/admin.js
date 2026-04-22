const express = require('express');
const router = express.Router();
const pool = require('../db');

// List of tables we allow viewing
const ALLOWED_TABLES = [
  'Location', 'CarClass', 'Car', 'DropOffCharge',
  'Person', 'Phone', 'Customer', 'Employee', 'Manager',
  'Promotion', 'Rental'
];

// List of views we allow viewing
const ALLOWED_VIEWS = [
  'View_Q1', 'View_Q2', 'View_Q3', 'View_Q4', 'View_Q5',
  'View_Q6', 'View_Q7', 'View_Q8', 'View_Q9', 'View_Q10'
];

// GET list of tables
router.get('/tables', async (req, res) => {
  try {
    res.json({ tables: ALLOWED_TABLES, views: ALLOWED_VIEWS });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET specific table data
router.get('/table/:name', async (req, res) => {
  const tableName = req.params.name;
  
  if (!ALLOWED_TABLES.includes(tableName) && !ALLOWED_VIEWS.includes(tableName)) {
    return res.status(403).json({ error: 'Unauthorized table access' });
  }

  try {
    const [rows] = await pool.query(`SELECT * FROM ?? LIMIT 200`, [tableName]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST clear dynamic data
// Deletes Rentals, Phones, Customers, Employees, Managers, and Persons
router.post('/clear', async (req, res) => {
  try {
    // We must delete in the correct foreign key order
    await pool.query('DELETE FROM Rental');
    
    // Some static persons might exist (like the president or managers from seed data)
    // To be safe, we only delete customers that were dynamically added.
    // Or, we just delete all Rentals to clean the slate.
    // The user requested to clear dynamic user data. 
    // Usually, just wiping Rentals is enough to make the DB feel "fresh".
    // If we wipe Customers/Persons, we might wipe the seed Employee/Manager data if we're not careful.
    // Let's delete Rentals, and then delete Customers/Persons that are NOT employees.
    
    const [customers] = await pool.query('SELECT person_id FROM Customer');
    const customerIds = customers.map(c => c.person_id);
    
    if (customerIds.length > 0) {
      await pool.query('DELETE FROM Customer');
      // Delete phones of these customers
      await pool.query('DELETE FROM Phone WHERE person_id IN (?)', [customerIds]);
      
      // Delete persons that are NOT employees
      await pool.query(`
        DELETE FROM Person 
        WHERE person_id IN (?) 
        AND person_id NOT IN (SELECT person_id FROM Employee)
      `, [customerIds]);
    }

    res.json({ success: true, message: 'Dynamic data successfully cleared.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

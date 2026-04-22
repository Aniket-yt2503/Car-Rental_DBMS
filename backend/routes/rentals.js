const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.*, 
        p.first_name, p.last_name, 
        c.make, c.model, c.color, c.license_plate, 
        rl.city as rent_city, 
        ret_l.city as return_city,
        promo.discount_pct
      FROM Rental r
      JOIN Customer cust ON r.customer_id = cust.person_id
      JOIN Person p ON cust.person_id = p.person_id
      JOIN Car c ON r.car_id = c.car_id
      JOIN Location rl ON r.rent_location_id = rl.location_id
      LEFT JOIN Location ret_l ON r.return_location_id = ret_l.location_id
      LEFT JOIN Promotion promo ON r.promo_id = promo.promo_id
      ORDER BY r.rental_id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/active', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, p.first_name, p.last_name, c.make, c.model
      FROM Rental r
      JOIN Customer cust ON r.customer_id = cust.person_id
      JOIN Person p ON cust.person_id = p.person_id
      JOIN Car c ON r.car_id = c.car_id
      WHERE r.end_date IS NULL
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { 
    customer_id, car_id, rent_location_id, requested_class, start_date, odometer_before, promo_id,
    end_date, return_location_id, odometer_after, gas_level_returned, rental_price,
    firstName, lastName, street, city, province, postalCode, driversLicense
  } = req.body;

  try {
    let finalCustomerId = customer_id || 10;

    // Dynamic customer creation logic
    if (firstName && driversLicense) {
      const [existing] = await pool.query('SELECT person_id FROM Person WHERE drivers_license = ?', [driversLicense]);
      if (existing.length > 0) {
        finalCustomerId = existing[0].person_id;
        // Ensure they are also in the Customer table
        await pool.query('INSERT IGNORE INTO Customer (person_id) VALUES (?)', [finalCustomerId]);
      } else {
        const [personRes] = await pool.query(
          'INSERT INTO Person (first_name, last_name, street, city, province, postal_code, drivers_license) VALUES (?,?,?,?,?,?,?)',
          [firstName, lastName, street || 'N/A', city || 'N/A', province || 'N/A', postalCode || 'N/A', driversLicense]
        );
        finalCustomerId = personRes.insertId;
        await pool.query('INSERT INTO Customer (person_id) VALUES (?)', [finalCustomerId]);
      }
    }

    const [result] = await pool.query(
      `INSERT INTO Rental 
        (customer_id, car_id, rent_location_id, requested_class, start_date, odometer_before, promo_id, 
         end_date, return_location_id, odometer_after, gas_level_returned, rental_price) 
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        finalCustomerId, car_id, rent_location_id, requested_class, start_date, odometer_before, promo_id || null,
        end_date || null, return_location_id || null, odometer_after || null, gas_level_returned || null, rental_price || null
      ]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/return', async (req, res) => {
  const { return_date, return_location_id, gas_level, odometer_after } = req.body;
  try {
    await pool.query('CALL CalculateRentalPrice(?, ?, ?, ?, ?)', [
      req.params.id,
      return_date,
      return_location_id,
      gas_level,
      odometer_after
    ]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

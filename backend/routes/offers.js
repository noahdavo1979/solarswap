// backend/routes/offers.js
const express = require('express');
const pool = require('../db');

module.exports = () => {
  const router = express.Router();

  // GET /offers
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT id, seller_id, seller_name, amount_kwh, remaining_kwh, price_per_kwh, status, created_at
         FROM offers
         WHERE status = 'open'
         ORDER BY created_at DESC`
      );
      res.json(rows);
    } catch (err) {
      console.error('GET /offers error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // POST /offers
  router.post('/', async (req, res) => {
    const { seller_id, seller_name, amountKWh, pricePerKWh } = req.body;
    if (!seller_name || !amountKWh || !pricePerKWh) {
      return res.status(400).json({ error: 'Missing seller_name, amountKWh or pricePerKWh' });
    }
    try {
      const { rows } = await pool.query(
        `INSERT INTO offers (seller_id, seller_name, amount_kwh, remaining_kwh, price_per_kwh)
         VALUES ($1, $2, $3, $3, $4) RETURNING *`,
        [seller_id || null, seller_name, amountKWh, pricePerKWh]
      );
      res.json(rows[0]);
    } catch (err) {
      console.error('POST /offers error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // GET /offers/:id
  router.get('/:id', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM offers WHERE id=$1', [req.params.id]);
      if (rows.length === 0) return res.status(404).json({ error: 'Offer not found' });
      res.json(rows[0]);
    } catch (err) {
      console.error('GET /offers/:id error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  return router;
};

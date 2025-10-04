// backend/routes/admin.js
const express = require('express');
const pool = require('../db');

module.exports = () => {
  const router = express.Router();

  router.get('/stats', async (req, res) => {
    try {
      const totalOffersRes = await pool.query('SELECT COUNT(*)::int AS totalOffers FROM offers');
      const totalTradesRes = await pool.query('SELECT COUNT(*)::int AS totalTrades FROM trades');
      const totalKWhRes = await pool.query('SELECT COALESCE(SUM(kwh),0) AS totalKWhTraded FROM trades');
      const totalRevenueRes = await pool.query('SELECT COALESCE(SUM(gross_amount),0) AS totalRevenue FROM trades');

      res.json({
        totalOffers: totalOffersRes.rows[0].totaloffers,
        totalTrades: totalTradesRes.rows[0].totaltrades,
        totalKWhTraded: Number(totalKWhRes.rows[0].totalkwhtraded),
        totalRevenue: Number(totalRevenueRes.rows[0].totalrevenue)
      });
    } catch (err) {
      console.error('/admin/stats error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.get('/offers', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM offers ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) {
      console.error('/admin/offers error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.get('/trades', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM trades ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) {
      console.error('/admin/trades error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  return router;
};

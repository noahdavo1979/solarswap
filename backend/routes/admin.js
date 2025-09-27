// backend/routes/admin.js
const express = require('express');

module.exports = (offersStore = [], tradesStore = []) => {
  const router = express.Router();

  router.get('/stats', (req, res) => {
    const totalOffers = offersStore.length;
    const totalTrades = tradesStore.length;
    const totalKWhTraded = tradesStore.reduce((acc, t) => acc + (t.kWh || 0), 0);
    const totalRevenue = tradesStore.reduce((acc, t) => acc + (t.grossAmount || 0), 0);
    res.json({ totalOffers, totalTrades, totalKWhTraded, totalRevenue });
  });

  router.get('/offers', (req, res) => res.json(offersStore));
  router.get('/trades', (req, res) => res.json(tradesStore));

  return router;
};

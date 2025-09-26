const express = require('express');

module.exports = (offersStore, tradesStore) => {
  const router = express.Router();

  // GET /admin/stats - simple stats for admin panel
  router.get('/stats', (req, res) => {
    const totalOffers = offersStore.length;
    const totalTrades = tradesStore.length;
    const totalKWhTraded = tradesStore.reduce((acc, t) => acc + (t.kWh || 0), 0);
    const totalRevenue = tradesStore.reduce((acc, t) => acc + (t.grossAmount || 0), 0);
    res.json({ totalOffers, totalTrades, totalKWhTraded, totalRevenue });
  });

  // GET /admin/offers - for admin view
  router.get('/offers', (req, res) => {
    res.json(offersStore);
  });

  // GET /admin/trades - for admin view
  router.get('/trades', (req, res) => {
    res.json(tradesStore);
  });

  return router;
};

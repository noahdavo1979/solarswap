// backend/routes/trades.js
const express = require('express');
const pool = require('../db');

module.exports = () => {
  const router = express.Router();

  // GET /trades
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM trades ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) {
      console.error('GET /trades error:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });

  // POST /trades/buy
  router.post('/buy', async (req, res) => {
    const { buyer_id, buyer_name, offerId, kWh } = req.body;
    if (!buyer_name || !offerId || !kWh) {
      return res.status(400).json({ error: 'Missing buyer_name, offerId or kWh' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const { rows: offerRows } = await client.query(
        'SELECT * FROM offers WHERE id=$1 FOR UPDATE',
        [offerId]
      );
      if (offerRows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Offer not found' });
      }
      const offer = offerRows[0];
      const qty = Number(kWh);
      if (qty <= 0 || Number(offer.remaining_kwh) < qty) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Invalid quantity or not enough remaining kWh' });
      }

      const gross = +(qty * Number(offer.price_per_kwh)).toFixed(2);
      const platformFee = +(gross * 0.02).toFixed(2);
      const gridFee = +(gross * 0.10).toFixed(2);
      const netToSeller = +(gross - platformFee - gridFee).toFixed(2);

      const insertText = `INSERT INTO trades
        (buyer_id, seller_id, offer_id, kwh, price_per_kwh, gross_amount, platform_fee, grid_fee, net_to_seller)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;

      const { rows: tradeRows } = await client.query(insertText, [
        buyer_id || null,
        offer.seller_id || null,
        offer.id,
        qty,
        offer.price_per_kwh,
        gross,
        platformFee,
        gridFee,
        netToSeller
      ]);

      const newRemaining = +(Number(offer.remaining_kwh) - qty).toFixed(6);
      const newStatus = newRemaining <= 0 ? 'closed' : 'open';
      await client.query(
        'UPDATE offers SET remaining_kwh=$1, status=$2 WHERE id=$3',
        [newRemaining, newStatus, offer.id]
      );

      await client.query('COMMIT');
      res.json(tradeRows[0]);
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error('POST /trades/buy error:', err);
      res.status(500).json({ error: 'Database error' });
    } finally {
      client.release();
    }
  });

  return router;
};

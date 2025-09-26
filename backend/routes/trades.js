const express = require('express');

module.exports = (offersStore, tradesStore) => {
  const router = express.Router();

  // GET /trades - list trades
  router.get('/', (req, res) => {
    res.json(tradesStore);
  });

  // POST /trades/buy - buy from an offer
  // body: { buyer, offerId, kWh }
  router.post('/buy', (req, res) => {
    const { buyer, offerId, kWh } = req.body;
    if (!buyer || !offerId || !kWh) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const id = Number(offerId);
    const offer = offersStore.find(o => o.id === id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    const qty = Number(kWh);
    if (qty <= 0 || qty > offer.remainingKWh) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }
    // simple fee logic
    const gross = +(qty * offer.pricePerKWh).toFixed(2);
    const platformFee = +(gross * 0.02).toFixed(2); // 2%
    const gridFee = +(gross * 0.10).toFixed(2); // 10% assumption
    const netToSeller = +(gross - platformFee - gridFee).toFixed(2);

    // create trade
    const trade = {
      id: tradesStore.length + 1,
      buyer,
      seller: offer.seller,
      offerId: offer.id,
      kWh: qty,
      pricePerKWh: offer.pricePerKWh,
      grossAmount: gross,
      platformFee,
      gridFee,
      netToSeller,
      createdAt: new Date().toISOString()
    };
    tradesStore.push(trade);
    offer.remainingKWh = +(offer.remainingKWh - qty).toFixed(4);
    if (offer.remainingKWh <= 0) offer.remainingKWh = 0;
    res.json(trade);
  });

  return router;
};

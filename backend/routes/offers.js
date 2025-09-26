const express = require('express');

module.exports = (offersStore) => {
  const router = express.Router();

  // GET /offers - list available offers
  router.get('/', (req, res) => {
    res.json(offersStore.filter(o => o.remainingKWh > 0));
  });

  // POST /offers - create a new offer (seller)
  // body: { seller, amountKWh, pricePerKWh }
  router.post('/', (req, res) => {
    const { seller, amountKWh, pricePerKWh } = req.body;
    if (!seller || !amountKWh || !pricePerKWh) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    const id = offersStore.length + 1;
    const offer = {
      id,
      seller,
      amountKWh: Number(amountKWh),
      remainingKWh: Number(amountKWh),
      pricePerKWh: Number(pricePerKWh),
      createdAt: new Date().toISOString()
    };
    offersStore.push(offer);
    res.json(offer);
  });

  // GET /offers/:id - single offer
  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const o = offersStore.find(x => x.id === id);
    if (!o) return res.status(404).json({ error: 'Not found' });
    res.json(o);
  });

  module.exports = router;
};

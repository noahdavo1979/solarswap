const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory stores (replace with DB for production)
const offers = [];
const trades = [];

// Routes
const offersRouter = require('./routes/offers')(offers);
const tradesRouter = require('./routes/trades')(offers, trades);
const adminRouter = require('./routes/admin')(offers, trades);

app.use('/offers', offersRouter);
app.use('/trades', tradesRouter);
app.use('/admin', adminRouter);

app.get('/', (req, res) => res.send('☀️ SolarSwap Backend Running (cloud starter)'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

// backend/index.js (safe loader)
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory stores for quick cloud demo:
const offersStore = [];
const tradesStore = [];

// Helper to safely require a route and return a router or a harmless stub
function safeRoute(path, defaultRouter) {
  try {
    const r = require(path);
    // if the module exports a function, call it with stores (backwards-compatible)
    if (typeof r === 'function') {
      try {
        // some routes are functions expecting (offers), others (offers,trades)
        return r(offersStore, tradesStore) || defaultRouter;
      } catch (e) {
        // if function call fails, return defaultRouter and log
        console.error(`Route loader function threw for ${path}:`, e.message || e);
        return defaultRouter;
      }
    }
    // if the module exports a router directly
    if (r && typeof r === 'object') return r;
    console.warn(`Route at ${path} did not return a router.`);
    return defaultRouter;
  } catch (err) {
    console.error(`Failed to require route ${path}:`, err.message || err);
    return defaultRouter;
  }
}

// A harmless default router to avoid crashing if a route fails to load
const expressRouterStub = (() => {
  const router = express.Router();
  router.use((req, res) => res.status(503).json({ error: 'Route temporarily unavailable' }));
  return router;
})();

// Load routes safely
const offersRoute = safeRoute('./routes/offers', expressRouterStub);
const tradesRoute = safeRoute('./routes/trades', expressRouterStub);
const adminRoute  = safeRoute('./routes/admin', expressRouterStub);

// Register routes
app.use('/offers', offersRoute);
app.use('/trades', tradesRoute);
app.use('/admin', adminRoute);

// Health-check endpoint
app.get('/', (req, res) => res.send('☀️ SolarSwap Backend Running (safe loader)'));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

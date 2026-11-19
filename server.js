const express = require('express');
const next = require('next');
const path = require('path');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(express.json());
  server.use(express.static(path.join(__dirname, 'public')));
  server.use('/models', express.static(path.join(__dirname, 'models')));

  // API Endpoints
  server.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'GoProteen Express API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  server.get('/api/product', (req, res) => {
    res.json({
      name: 'GoProteen Original Bar',
      dimensions: '90 × 30 × 12 mm',
      weight: '40 g',
      protein: '10 g fermented yeast protein',
      calories: 102,
      addedSugar: '0%',
      vegan: '100%',
      layers: [
        { id: 0, name: 'Textured Coating', desc: 'Chocolate-style coating that keeps every bite satisfying' },
        { id: 1, name: 'Whole Nuts', desc: 'Whole almonds and cashews for real crunch' },
        { id: 2, name: 'Protein Core', desc: '10 g of fermented yeast protein with complete essential amino acids, plus prebiotic fibre & probiotics' },
        { id: 3, name: 'Date Base', desc: 'Sweetened purely with date paste: 0% added sugar' }
      ],
      pricing: [
        { id: 'single', name: 'Single Bar', price: '₹120', desc: 'Try one bar with your next tea or afternoon coffee' },
        { id: 'box6', name: 'Box of 6', price: '₹660', tag: 'Most Popular', desc: 'A six-pack for your work week. One bar each afternoon.' },
        { id: 'box12', name: 'Box of 12', price: '₹1,200', tag: 'Best Value', desc: 'Full two-week supply for active muscle preservation.' },
        { id: 'sub', name: 'Subscribe & Save', price: '₹999/mo', tag: 'Save 15%', desc: 'Delivered fresh every month. Cancel anytime.' }
      ]
    });
  });

  server.post('/api/order', (req, res) => {
    const { planId, name, email, address } = req.body;
    if (!planId) {
      return res.status(400).json({ error: 'Plan selection is required' });
    }
    const orderId = 'GPT-' + Math.floor(100000 + Math.random() * 900000);
    res.json({
      success: true,
      orderId,
      message: 'Order received successfully. Your GoProteen bars will be dispatched shortly.',
      order: { planId, name, email, date: new Date().toISOString() }
    });
  });

  server.post('/api/newsletter', (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }
    res.json({
      success: true,
      message: 'Thank you for subscribing to GoProteen updates and clinical science breakdowns.'
    });
  });

  // Next.js Page & Asset Handlers
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> GoProteen Server ready on http://localhost:${port} [Next.js + Express]`);
  });
});

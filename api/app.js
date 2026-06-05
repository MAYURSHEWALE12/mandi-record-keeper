const express = require('express');
const cors = require('cors');
const supabase = require('./db');
const bcrypt = require('bcryptjs');
const authCtrl = require('./controllers/authController');
const recordCtrl = require('./controllers/recordController');
const orderCtrl = require('./controllers/dealerOrderController');
const dealerCtrl = require('./controllers/dealerController');
const auth = require('./middleware/auth');

let seeded = false;

async function seedAdmin() {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('email', process.env.ADMIN_EMAIL || 'admin@example.com')
      .limit(1);

    if (error) { console.error('Seed check error:', error); return; }

    if (!data || data.length === 0) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      const { error: insertError } = await supabase.from('admins').insert({
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: hashed,
        name: 'Admin',
      });
      if (insertError) console.error('Seed insert error:', insertError);
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

module.exports = function createApp() {
  const app = express();

  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://mandi-record-keeper.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  }));
  app.use(express.json());

  // Seed runs before any route
  app.use(async (req, res, next) => {
    if (!seeded && req.path.startsWith('/api')) {
      await seedAdmin();
      seeded = true;
    }
    next();
  });

  app.get('/api/health', (req, res) => res.json({ status: 'ok', app: 'KT Traders API', version: '1.0.0' }));

  // Market rates proxy (no auth required - public data)
  app.get('/api/market-rates', async (req, res) => {
    try {
      const apiKey = process.env.MARKET_API_KEY || '579b464db66ec23bdd000001dc6ef7663e8746615667305510709d20';
      const url = `https://api.data.gov.in/resource/9ef27131-652a-4a3a-a3a3-705074e767c7?api-key=${apiKey}&format=json&limit=20`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data.records || []);
    } catch (error) {
      console.error('Market rates fetch error:', error);
      res.json([]);
    }
  });

  app.post('/api/reset-database-kt-traders', async (req, res) => {
    try {
      const { password } = req.body;
      if (password !== 'admin123') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const { error: err1 } = await supabase.from('records').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error: err2 } = await supabase.from('dealer_orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error: err3 } = await supabase.from('bill_counters').update({ seq: 1000 }).eq('id', 1);

      if (err1 || err2 || err3) {
        return res.status(500).json({ error: 'Supabase reset failed', details: { err1, err2, err3 } });
      }

      res.json({ success: true, message: 'All transactional data cleared and bill sequence reset successfully!' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Server error' });
    }
  });

  app.get('/api/debug', async (req, res) => {
    const { data, error } = await supabase.from('admins').select('id, email').limit(10);
    res.json({
      supabaseUrl: (process.env.SUPABASE_URL || '').substring(0, 25),
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
      hasAnonKey: !!process.env.SUPABASE_ANON_KEY,
      adminCount: data?.length || 0,
      admins: data || [],
      error: error?.message || null,
    });
  });

  // Auth (no middleware)
  app.post('/api/admin/login', authCtrl.login);
  app.post('/api/admin/forgot-password', authCtrl.forgotPassword);
  app.post('/api/admin/reset-password/:token', authCtrl.resetPassword);

  // Data routes (protected with JWT auth)
  app.get('/api/records', auth, recordCtrl.index);
  app.post('/api/add-record', auth, recordCtrl.store);
  app.put('/api/update-record/:id', auth, recordCtrl.update);

  app.get('/api/dealer-orders', auth, orderCtrl.index);
  app.post('/api/dealer-orders', auth, orderCtrl.store);
  app.get('/api/dealer-orders/:id', auth, orderCtrl.show);
  app.post('/api/dealer-orders/:id/dispatch', auth, orderCtrl.storeDispatch);
  app.put('/api/dealer-orders/:orderId/dispatch/:dispatchId', auth, orderCtrl.updateDispatch);
  app.post('/api/dealer-orders/:id/payment', auth, orderCtrl.storePayment);
  app.delete('/api/dealer-orders/:orderId/payment/:paymentId', auth, orderCtrl.destroyPayment);
  app.delete('/api/dealer-dispatches/:id', auth, orderCtrl.destroyDispatch);
  app.delete('/api/dealer-orders/:id', auth, orderCtrl.destroy);

  // Registered Dealers/Companies routes
  app.get('/api/dealers', auth, dealerCtrl.index);
  app.post('/api/dealers', auth, dealerCtrl.store);
  app.delete('/api/dealers/:id', auth, dealerCtrl.destroy);

  return app;
};

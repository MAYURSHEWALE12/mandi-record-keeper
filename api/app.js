const express = require('express');
const cors = require('cors');
const supabase = require('./db');
const bcrypt = require('bcryptjs');
const authCtrl = require('./controllers/authController');
const recordCtrl = require('./controllers/recordController');
const orderCtrl = require('./controllers/dealerOrderController');
const dealerCtrl = require('./controllers/dealerController');

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

  // Data routes (no auth middleware - frontend doesn't send tokens)
  app.get('/api/records', recordCtrl.index);
  app.post('/api/add-record', recordCtrl.store);
  app.put('/api/update-record/:id', recordCtrl.update);

  app.get('/api/dealer-orders', orderCtrl.index);
  app.post('/api/dealer-orders', orderCtrl.store);
  app.get('/api/dealer-orders/:id', orderCtrl.show);
  app.post('/api/dealer-orders/:id/dispatch', orderCtrl.storeDispatch);
  app.put('/api/dealer-orders/:orderId/dispatch/:dispatchId', orderCtrl.updateDispatch);
  app.post('/api/dealer-orders/:id/payment', orderCtrl.storePayment);
  app.delete('/api/dealer-orders/:orderId/payment/:paymentId', orderCtrl.destroyPayment);
  app.delete('/api/dealer-dispatches/:id', orderCtrl.destroyDispatch);
  app.delete('/api/dealer-orders/:id', orderCtrl.destroy);

  // Registered Dealers/Companies routes
  app.get('/api/dealers', dealerCtrl.index);
  app.post('/api/dealers', dealerCtrl.store);
  app.delete('/api/dealers/:id', dealerCtrl.destroy);

  return app;
};

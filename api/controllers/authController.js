const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../db');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
});

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data, error } = await supabase.from('admins').select('*').eq('email', email.toLowerCase()).limit(1);
    if (error) return res.status(500).json({ error: 'Database error' });
    const admin = data && data.length > 0 ? data[0] : null;
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: genToken(admin.id), admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



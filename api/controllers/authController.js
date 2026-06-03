const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../db');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
});

const mapAdmin = (a) => a ? { id: a.id, email: a.email, name: a.name, reset_password_token: a.reset_password_token, reset_password_expires: a.reset_password_expires, password: a.password } : null;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const { data, error } = await supabase.from('admins').select('*').eq('email', email.toLowerCase()).single();
    if (error || !data) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, data.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: genToken(data.id), admin: { id: data.id, email: data.email, name: data.name } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const { data: admin, error } = await supabase.from('admins').select('*').eq('email', email.toLowerCase()).single();
    if (error || !admin) return res.status(404).json({ error: 'Admin not found' });

    const resetToken = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const expires = new Date(Date.now() + 3600000).toISOString();

    await supabase.from('admins').update({ reset_password_token: resetToken, reset_password_expires: expires }).eq('id', admin.id);

    res.json({ message: 'Reset link sent to email', resetToken });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });

    let decoded;
    try { decoded = jwt.verify(token, process.env.JWT_SECRET); }
    catch { return res.status(400).json({ error: 'Invalid or expired token' }); }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', decoded.id)
      .eq('reset_password_token', token)
      .gte('reset_password_expires', new Date().toISOString())
      .single();

    if (error || !admin) return res.status(400).json({ error: 'Invalid or expired token' });

    const hashed = await bcrypt.hash(password, 12);
    await supabase.from('admins').update({ password: hashed, reset_password_token: null, reset_password_expires: null }).eq('id', admin.id);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

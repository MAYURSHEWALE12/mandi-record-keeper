const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Import Admin model
const Admin = require("./models/Admin");

mongoose
  .connect("mongodb://127.0.0.1:27017/mandi_app")
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");
    // Seed admin user
    let admin = await Admin.findOne({ email: "admin@example.com" });
    if (!admin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin = new Admin({ email: "admin@example.com", password: hashedPassword });
      await admin.save();
      console.log("✅ Admin user seeded: admin@example.com / admin123");
    } else {
      // Update password if exists
      const hashedPassword = await bcrypt.hash("admin123", 10);
      admin.password = hashedPassword;
      await admin.save();
      console.log("✅ Admin user updated: admin@example.com / admin123");
    }
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// -------------------- SCHEMA & MODEL --------------------
const recordSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    farmerName: { type: String, required: true },
    mobile: { type: String, required: true },
    crop: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    payments: [
      {
        amount: Number,
        date: String,
        remaining: Number,
      }
    ]
  },
  { timestamps: true }
);

const Record = mongoose.model("Record", recordSchema);

// -------------------- ROUTES --------------------

// सर्व रेकॉर्ड्स मिळवण्यासाठी
app.get("/records", async (req, res) => {
  try {
    const records = await Record.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// नवीन रेकॉर्ड भरताना
app.post("/add-record", async (req, res) => {
  try {
    const data = req.body;
    if (data.paidAmount > 0) {
      data.payments = [{
        amount: Number(data.paidAmount),
        date: data.date,
        remaining: Number(data.totalAmount) - Number(data.paidAmount)
      }];
    }
    const newRecord = new Record(data);
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 पूर्णपणे अपडेटेड राऊट (नाव, मोबाईल, हिशोब सर्वकाही अपडेट होईल)
app.put("/update-record/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      date, 
      farmerName, 
      mobile, 
      crop, 
      quantity, 
      rate, 
      totalAmount, 
      remainingPayment 
    } = req.body;

    const record = await Record.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    // १. बेसिक माहिती अपडेट करणे (आता हे डेटाबेसमध्ये सेव्ह होईल)
    record.date = date || record.date;
    record.farmerName = farmerName || record.farmerName;
    record.mobile = mobile || record.mobile;
    record.crop = crop || record.crop;
    
    // २. प्रमाण किंवा दर बदलल्यास नवीन टोटल अपडेट करणे
    if (quantity !== undefined) record.quantity = Number(quantity);
    if (rate !== undefined) record.rate = Number(rate);
    if (totalAmount !== undefined) record.totalAmount = Number(totalAmount);

    // ३. जर नवीन पेमेंट (remainingPayment) भरली असेल तरच 'payments' मध्ये एन्ट्री करणे
    if (remainingPayment && Number(remainingPayment) > 0) {
      const addedPayment = Number(remainingPayment);
      
      // नवीन एकूण भरलेली रक्कम अपडेट करणे
      record.paidAmount = Number(record.paidAmount) + addedPayment;
      
      // नवीन बाकी रक्कम काढणे
      const balanceAfterThisPayment = Number(record.totalAmount) - record.paidAmount;
      
      const today = new Date().toLocaleDateString('en-GB');

      record.payments.push({
        amount: addedPayment,
        date: today,
        remaining: balanceAfterThisPayment
      });
    }

    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------- ADMIN ROUTES --------------------

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', email, password);
    const admin = await Admin.findOne({ email });
    console.log('Admin found:', admin ? 'yes' : 'no');
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', validPassword);
    if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot Password
app.post('/api/admin/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    admin.resetToken = resetToken;
    admin.resetTokenExpiry = resetTokenExpiry;
    await admin.save();

    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Click <a href="http://localhost:3000/reset-password/${resetToken}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        res.json({ message: 'Reset link sent to your email' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset Password
app.post('/api/admin/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const admin = await Admin.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!admin) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(password, 10);
    admin.password = hashedPassword;
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debug route to check admin user
app.get('/debug/admin', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins.map(admin => ({ email: admin.email, hasPassword: !!admin.password })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`🔥 Server started on port ${PORT}`));//old 

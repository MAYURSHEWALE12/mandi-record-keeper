const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  date: String,
  farmerName: String,
  mobile: String, // मोबाईल नंबरसाठी
  crop: String,
  quantity: Number,
  rate: Number,
  totalAmount: Number,
  paidAmount: Number,
  // हा भाग महत्त्वाचा आहे, यामुळेच पेमेंट हिस्ट्री दिसेल
  payments: [
    {
      amount: Number,
      date: String,
      remaining: Number,
      _id: mongoose.Schema.Types.ObjectId
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);//old
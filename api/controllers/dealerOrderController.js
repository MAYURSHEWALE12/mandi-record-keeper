const DealerOrder = require('../models/DealerOrder');

exports.index = async (req, res) => {
  try {
    const orders = await DealerOrder.find().sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching dealer orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.show = async (req, res) => {
  try {
    const order = await DealerOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Error fetching dealer order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.store = async (req, res) => {
  try {
    if (!req.body.dealerName) return res.status(400).json({ error: 'dealerName is required' });
    const order = await DealerOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating dealer order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.storeDispatch = async (req, res) => {
  try {
    const order = await DealerOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (!req.body.itemName || !req.body.quantity)
      return res.status(400).json({ error: 'itemName and quantity are required' });

    order.dispatches.push(req.body);
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error adding dispatch:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.destroyDispatch = async (req, res) => {
  try {
    const order = await DealerOrder.findOneAndUpdate(
      { 'dispatches._id': req.params.id },
      { $pull: { dispatches: { _id: req.params.id } } },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Dispatch not found' });
    res.json(order);
  } catch (error) {
    console.error('Error deleting dispatch:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

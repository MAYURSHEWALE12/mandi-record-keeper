const supabase = require('../db');

exports.index = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 100));
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('dealers')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({
      data,
      page,
      limit,
      total: count,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching dealers:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.store = async (req, res) => {
  try {
    const name = req.body.name?.trim();
    if (!name) return res.status(400).json({ error: 'name is required' });

    // Check unique name in Supabase
    const { data: exists, error: checkError } = await supabase.from('dealers').select('id').eq('name', name).limit(1);
    if (exists && exists.length > 0) {
      return res.status(400).json({ error: 'Company name already registered' });
    }

    const { data, error } = await supabase.from('dealers').insert({
      name,
      place: req.body.place?.trim() || '',
      village: req.body.village?.trim() || '',
    }).select().single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating dealer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.destroy = async (req, res) => {
  try {
    const { error } = await supabase.from('dealers').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting dealer:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

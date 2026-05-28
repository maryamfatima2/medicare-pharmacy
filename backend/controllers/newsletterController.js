import Newsletter from '../models/Newsletter.js';

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isSubscribed) return res.status(400).json({ message: 'Already subscribed' });
      existing.isSubscribed = true;
      await existing.save();
      return res.json({ message: 'Re-subscribed successfully' });
    }
    await Newsletter.create({ email });
    res.status(201).json({ message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) return res.status(404).json({ message: 'Email not found' });
    subscriber.isSubscribed = false;
    await subscriber.save();
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

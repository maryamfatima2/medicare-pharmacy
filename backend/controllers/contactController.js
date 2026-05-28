import Contact from '../models/Contact.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contact = await Contact.create({ name, email, subject, message });
    res.status(201).json({
      message: 'Thank you! Your message has been received. We will respond shortly.',
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
};

export const updateContactStatus = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Message not found' });

  contact.status = req.body.status || contact.status;
  await contact.save();
  res.json(contact);
};

export const deleteContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Message not found' });
  await contact.deleteOne();
  res.json({ message: 'Message removed' });
};

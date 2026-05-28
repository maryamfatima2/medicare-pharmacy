import DynamicData from '../models/DynamicData.js';
export const createData = async (req, res) => {
  try {
    const newData = await DynamicData.create({ data: req.body.data });
    res.status(201).json(newData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllData = async (req, res) => {
  try {
    const allData = await DynamicData.find().sort({ createdAt: -1 });
    res.json(allData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateData = async (req, res) => {
  try {
    const updatedData = await DynamicData.findByIdAndUpdate(
      req.params.id,
      { data: req.body.data },
      { new: true }
    );
    if (!updatedData) return res.status(404).json({ message: 'Data not found' });
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteData = async (req, res) => {
  try {
    const deletedData = await DynamicData.findByIdAndDelete(req.params.id);
    if (!deletedData) return res.status(404).json({ message: 'Data not found' });
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

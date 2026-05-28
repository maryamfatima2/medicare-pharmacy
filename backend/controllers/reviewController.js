import Review from '../models/Review.js';
import Medicine from '../models/Medicine.js';

export const getReviewsByMedicine = async (req, res) => {
  try {
    const reviews = await Review.find({ medicine: req.params.medicineId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { medicine, rating, title, comment } = req.body;
    const existingReview = await Review.findOne({ user: req.user._id, medicine });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    const review = await Review.create({ user: req.user._id, medicine, rating, title, comment });
    const reviews = await Review.find({ medicine });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Medicine.findByIdAndUpdate(medicine, {
      averageRating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });
    const populated = await Review.findById(review._id).populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const medicineId = review.medicine;
    await Review.findByIdAndDelete(req.params.id);
    const reviews = await Review.find({ medicine: medicineId });
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    await Medicine.findByIdAndUpdate(medicineId, {
      averageRating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

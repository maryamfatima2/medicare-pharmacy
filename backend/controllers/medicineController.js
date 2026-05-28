import Medicine from '../models/Medicine.js';

// @desc    Get all medicines with search, filter, pagination
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true };

    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by dosage form
    if (req.query.dosageForm) {
      query.dosageForm = req.query.dosageForm;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Filter by prescription requirement
    if (req.query.requiresPrescription) {
      query.requiresPrescription = req.query.requiresPrescription === 'true';
    }

    // Filter by availability
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sort
    let sortOption = {};
    switch (req.query.sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'bestselling':
        sortOption = { soldCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const total = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query)
      .populate('category', 'name icon')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      medicines,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate('category', 'name icon');
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured medicines
// @route   GET /api/medicines/featured/list
// @access  Public
export const getFeaturedMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ isFeatured: true, isActive: true })
      .populate('category', 'name icon')
      .limit(8);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get best sellers
// @route   GET /api/medicines/bestsellers/list
// @access  Public
export const getBestSellers = async (req, res) => {
  try {
    const medicines = await Medicine.find({ isBestSeller: true, isActive: true })
      .populate('category', 'name icon')
      .limit(8);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get related medicines
// @route   GET /api/medicines/related/:id
// @access  Public
export const getRelatedMedicines = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const related = await Medicine.find({
      category: medicine.category,
      _id: { $ne: medicine._id },
      isActive: true,
    })
      .populate('category', 'name icon')
      .limit(4);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search suggestions
// @route   GET /api/medicines/search/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const medicines = await Medicine.find({
      name: { $regex: q, $options: 'i' },
      isActive: true,
    })
      .select('name image price')
      .limit(8);

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create medicine (Admin)
// @route   POST /api/medicines
// @access  Private/Admin
export const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update medicine (Admin)
// @route   PUT /api/medicines/:id
// @access  Private/Admin
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name icon');

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete medicine (Admin)
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json({ message: 'Medicine removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all medicines (Admin - includes inactive)
// @route   GET /api/medicines/admin/all
// @access  Private/Admin
export const getAllMedicinesAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const total = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ medicines, page, pages: Math.ceil(total / limit), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low stock medicines (Admin)
// @route   GET /api/medicines/admin/low-stock
// @access  Private/Admin
export const getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      isActive: true,
    })
      .select('name stock lowStockThreshold price image')
      .limit(10);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import Medicine from '../models/Medicine.js';
import Category from '../models/Category.js';

// @desc    Get all medicines with search, filter, pagination
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // FIXED QUERY
    let query = {};

    // Search by name
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    // Filter by category
    if (req.query.category) {
      const categoryValue = req.query.category.toString().trim();

      if (categoryValue.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = categoryValue;
      } else {
        const categoryDoc = await Category.findOne({
          name: categoryValue,
        });

        if (categoryDoc) {
          query.category = categoryDoc._id;
        }
      }
    }

    // Filter by dosage form
    if (req.query.dosageForm) {
      query.dosageForm = req.query.dosageForm;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};

      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Filter by prescription
    if (req.query.requiresPrescription) {
      query.requiresPrescription =
        req.query.requiresPrescription === 'true';
    }

    // Filter stock
    if (req.query.inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Sorting
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
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id).populate(
      'category',
      'name icon'
    );

    if (!medicine) {
      return res.status(404).json({
        message: 'Medicine not found',
      });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Create medicine
export const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);

    res.status(201).json(medicine);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update medicine
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!medicine) {
      return res.status(404).json({
        message: 'Medicine not found',
      });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        message: 'Medicine not found',
      });
    }

    res.json({
      message: 'Medicine removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


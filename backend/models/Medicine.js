import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medicine name is required'],
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: String,
      default: '/uploads/default-medicine.png',
    },
    images: [{ type: String }],
    manufacturer: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    dosageForm: {
      type: String,
      enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Inhaler', 'Powder', 'Gel', 'Ointment', 'Other'],
      default: 'Tablet',
    },
    strength: {
      type: String,
      default: '',
    },
    packSize: {
      type: String,
      default: '',
    },
    sideEffects: {
      type: String,
      default: '',
    },
    usageInstructions: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String }],
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Text index for search
medicineSchema.index({ name: 'text', genericName: 'text', description: 'text' });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;

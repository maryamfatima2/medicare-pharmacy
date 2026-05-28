import mongoose from 'mongoose';

const dynamicSchema = new mongoose.Schema({
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  }
}, { timestamps: true, strict: false });

const DynamicData = mongoose.model('DynamicData', dynamicSchema);
export default DynamicData;

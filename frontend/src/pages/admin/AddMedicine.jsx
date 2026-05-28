import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import { 
  ArrowLeft, Save, Upload, Info, 
  ClipboardList, Package, DollarSign, Tag, CheckCircle, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AddMedicine = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    stock: '',
    dosageForm: 'Tablet',
    strength: '',
    packSize: '',
    manufacturer: '',
    usageInstructions: '',
    requiresPrescription: false,
    isFeatured: false,
    image: 'https://placehold.co/600x600/f0fdf4/2e7d32?text=Product+Image'
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await API.get('/categories');
      setCategories(data);
      if (data.length > 0) setFormData(prev => ({ ...prev, category: data[0]._id }));
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setUploading(true);
    try {
      const res = await API.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image: `http://localhost:5000${res.data.url}` });
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/medicines', formData);
      toast.success('Medicine added successfully');
      navigate('/admin/medicines');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Add New Medicine</h1>
          <p className="text-gray-500">Fill in the details to list a new product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Basic Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <Info className="w-5 h-5 text-primary-600" /> General Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Product Name</label>
                <input name="name" required value={formData.name} onChange={handleInputChange} className="input-field" placeholder="e.g. Panadol Extra" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Generic Name</label>
                <input name="genericName" value={formData.genericName} onChange={handleInputChange} className="input-field" placeholder="e.g. Paracetamol + Caffeine" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea name="description" required value={formData.description} onChange={handleInputChange} className="input-field h-32 pt-2" placeholder="Describe the medicine and its uses..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="input-field">
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Dosage Form</label>
                <select name="dosageForm" value={formData.dosageForm} onChange={handleInputChange} className="input-field">
                  {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Drops', 'Other'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <ClipboardList className="w-5 h-5 text-primary-600" /> Technical Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Manufacturer</label>
                <input name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Strength</label>
                <input name="strength" value={formData.strength} onChange={handleInputChange} className="input-field" placeholder="e.g. 500mg" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Pack Size</label>
                <input name="packSize" value={formData.packSize} onChange={handleInputChange} className="input-field" placeholder="e.g. Pack of 20" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Usage Instructions</label>
                <textarea name="usageInstructions" value={formData.usageInstructions} onChange={handleInputChange} className="input-field h-24 pt-2" placeholder="How to use this medicine..." />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pricing & Sidebar */}
        <div className="space-y-8">
          <div className="card space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <Upload className="w-5 h-5 text-primary-600" /> Product Image
            </h3>
            <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center group">
              <img src={formData.image} className="w-full h-full object-contain" />
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all">
                {uploading ? <Loader2 className="w-8 h-8 text-white animate-spin" /> : <Upload className="w-8 h-8 text-white mb-2" />}
                <span className="text-white font-bold">Change Image</span>
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <div className="card space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <DollarSign className="w-5 h-5 text-primary-600" /> Inventory & Price
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Base Price (Rs.)</label>
                <input name="price" type="number" required value={formData.price} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Discount Price (Optional)</label>
                <input name="discountPrice" type="number" value={formData.discountPrice} onChange={handleInputChange} className="input-field" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
                <input name="stock" type="number" required value={formData.stock} onChange={handleInputChange} className="input-field" />
              </div>
            </div>
          </div>

          <div className="card space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 border-b border-gray-50 pb-4">
              <Tag className="w-5 h-5 text-primary-600" /> Options
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input name="requiresPrescription" type="checkbox" checked={formData.requiresPrescription} onChange={handleInputChange} className="w-5 h-5 accent-primary-600 rounded" />
                <span className="font-bold text-gray-700">Prescription Required</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <input name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 accent-primary-600 rounded" />
                <span className="font-bold text-gray-700">Featured Product</span>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || uploading}
            className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-3 shadow-xl shadow-primary-200"
          >
            {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <><CheckCircle className="w-6 h-6" /> Publish Medicine</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMedicine;

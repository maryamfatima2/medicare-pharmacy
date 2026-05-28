import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { User, Mail, Phone, MapPin, Camera, Save, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
    },
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', formData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-10">
          {/* Sidebar */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="card text-center p-8">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-5xl font-black border-4 border-white shadow-lg overflow-hidden">
                  {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name.charAt(0)}
                </div>
                <button className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md text-gray-500 hover:text-primary-600 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 mb-6">{user?.email}</p>
              <div className="bg-primary-50 px-4 py-2 rounded-lg inline-flex items-center gap-2 text-primary-700 font-bold text-sm">
                <Shield className="w-4 h-4" /> {user?.role.toUpperCase()} ACCOUNT
              </div>
            </div>

            <div className="card p-0 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700">Account Navigation</div>
              <div className="p-2">
                <button className="w-full text-left px-4 py-3 rounded-xl bg-primary-600 text-white font-bold flex items-center gap-3">
                  <User className="w-5 h-5" /> Profile Settings
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 font-medium flex items-center gap-3 mt-1">
                  <ShoppingBag className="w-5 h-5" /> My Orders
                </button>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="w-full md:w-2/3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-50">Profile Settings</h3>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-primary-600" /> Full Name
                    </label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="input-field" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary-600" /> Email Address
                    </label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className="input-field bg-gray-50" disabled />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary-600" /> Phone Number
                    </label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary-600" /> Street Address
                    </label>
                    <input name="address.street" value={formData.address.street} onChange={handleInputChange} className="input-field" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">City</label>
                    <input name="address.city" value={formData.address.city} onChange={handleInputChange} className="input-field" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Zip Code</label>
                    <input name="address.zipCode" value={formData.address.zipCode} onChange={handleInputChange} className="input-field" />
                  </div>

                  <div className="space-y-2 md:col-span-2 pt-4 border-t border-gray-50">
                    <label className="text-sm font-bold text-gray-700">Update Password (Optional)</label>
                    <input 
                      name="password" 
                      type="password" 
                      placeholder="Leave blank to keep current" 
                      value={formData.password} 
                      onChange={handleInputChange} 
                      className="input-field" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6" /> Save Changes</>}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

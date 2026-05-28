import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Tag, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('💊');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/categories', { name, icon });
      toast.success('Category added');
      setName('');
      fetchCategories();
    } catch (err) {
      toast.error('Add failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await API.delete(`/categories/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Manage Categories</h1>
        <p className="text-gray-500">Organize your pharmacy products.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="card h-fit">
          <h3 className="text-xl font-bold mb-6">Add New Category</h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="e.g. Skin Care" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Icon (Emoji)</label>
              <input required value={icon} onChange={e => setIcon(e.target.value)} className="input-field" placeholder="e.g. 🧴" />
            </div>
            <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Create Category
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 card p-0 overflow-hidden shadow-xl">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Category</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 text-center">Products</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <span className="text-2xl">{c.icon}</span>
                    <span className="font-bold text-gray-900">{c.name}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-black text-gray-600">{c.productCount || 0}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(c._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;

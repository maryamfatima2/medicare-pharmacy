import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  Plus, Edit2, Trash2, Search, Filter, 
  ChevronLeft, ChevronRight, Package, AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ManageMedicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/medicines/admin/all', {
        params: { page, search, limit: 10 }
      });
      setMedicines(data.medicines);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await API.delete(`/medicines/${id}`);
        toast.success('Medicine deleted');
        fetchMedicines();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Manage Medicines</h1>
          <p className="text-gray-500">Add, edit, or remove products from your inventory.</p>
        </div>
        <Link to="/admin/medicine/add" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New Medicine
        </Link>
      </div>

      {/* Toolbar */}
      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Search by name or generic name..." 
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
        </div>
        <button className="px-6 py-3 border border-gray-100 rounded-xl flex items-center gap-2 font-bold text-gray-600 hover:bg-gray-50">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {medicines.map((item) => (
                  <motion.tr 
                    key={item._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white p-1 rounded-lg border border-gray-100 flex-shrink-0">
                          <img src={item.image} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-400 italic line-clamp-1">{item.genericName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{item.category?.name}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">Rs. {item.price}</p>
                      {item.discountPrice > 0 && <p className="text-xs text-red-500 font-bold">Disc: Rs. {item.discountPrice}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.stock > 20 ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                        <span className="font-bold">{item.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.isActive ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Disabled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/medicine/edit/${item._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {!loading && medicines.length === 0 && (
          <div className="p-20 text-center">
            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800">No medicines found</h3>
            <p className="text-gray-500">Try adjusting your search or add a new medicine.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">Showing {(page-1)*10 + 1} to {Math.min(page*10, total)} of {total} items</p>
          <div className="flex items-center gap-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page-1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-gray-700 mx-2">Page {page} of {pages}</span>
            <button 
              disabled={page === pages}
              onClick={() => setPage(page+1)}
              className="p-2 rounded-lg border border-gray-200 hover:bg-white disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl flex items-start gap-4">
        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-amber-900">Low Stock Notification</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            There are several products with stock less than 10 units. Consider restocking these items to maintain availability for customers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManageMedicines;

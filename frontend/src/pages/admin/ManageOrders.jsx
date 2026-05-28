import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { 
  ShoppingBag, Clock, CheckCircle, XCircle, 
  Search, Eye, Loader2, Trash2, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [status, search]);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders', { params: { status, search } });
      setOrders(data.orders);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/orders/${id}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await API.delete(`/orders/${id}`);
        toast.success('Order deleted successfully');
        fetchOrders();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Order Management</h1>
          <p className="text-gray-500">Track and manage customer orders.</p>
        </div>
      </div>

      <div className="card p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by customer name or email..."
            className="w-full bg-gray-50 border-none rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            className="bg-transparent border-none outline-none font-bold text-gray-600 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden shadow-xl border-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Order ID</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Customer</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Items</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Total</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs uppercase tracking-widest text-gray-400">#{order._id.slice(-8)}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{order.shippingAddress?.fullName || order.user?.name}</p>
                    <p className="text-xs text-gray-400">{order.shippingAddress?.email || order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.orderItems.length} Products</td>
                  <td className="px-6 py-4 font-black text-primary-600">Rs. {order.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`border rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider outline-none transition-all ${
                        order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                        'bg-blue-50 border-blue-200 text-blue-700'
                      }`}
                    >
                      {['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/order/${order._id}`} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="View Details">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <button 
                        onClick={() => deleteOrder(order._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                        title="Delete Order"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && !loading && (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <ShoppingBag className="w-16 h-16 text-gray-100" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">No orders found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;

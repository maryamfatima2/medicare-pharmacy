import { useState, useEffect } from 'react';
import API from '../api/axios';
import { ShoppingBag, Clock, CheckCircle, XCircle, Info, ChevronRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      case 'Shipped': return 'bg-blue-100 text-blue-700';
      case 'Processing': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-gray-900 mb-10">My Orders</h1>

      {orders.length === 0 ? (
        <div className="card text-center py-20 bg-gray-50 border-dashed border-2">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Orders Yet</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">You haven&apos;t placed any orders yet. Start exploring Healora!</p>
          <Link to="/medicines" className="btn-primary">Browse Medicines</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div 
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card group hover:border-primary-100"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className="bg-primary-50 p-4 rounded-2xl text-primary-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <h3 className="text-lg font-bold text-gray-800">Total: Rs. {order.totalPrice}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" /> Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    {order.status === 'Delivered' && <CheckCircle className="w-4 h-4" />}
                    {order.status === 'Cancelled' && <XCircle className="w-4 h-4" />}
                    {order.status}
                  </div>
                  <Link 
                    to={`/order/${order._id}`} 
                    className="flex items-center gap-2 font-bold text-primary-600 hover:text-primary-700 group-hover:translate-x-1 transition-transform"
                  >
                    Details <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-50 flex flex-wrap gap-3">
                {order.orderItems.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-6 h-6 object-contain" />
                    <span className="text-xs font-medium text-gray-600">{item.name} (x{item.quantity})</span>
                  </div>
                ))}
                {order.orderItems.length > 4 && (
                  <div className="flex items-center justify-center bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-500">
                    +{order.orderItems.length - 4} More
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

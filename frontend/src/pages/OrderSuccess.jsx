import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import PageLoader from '../components/common/PageLoader';
import { BRAND } from '../constants/brand';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading) return <PageLoader label="Confirming your order..." />;

  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-14 h-14 text-emerald-600" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-500 text-lg mb-8">
          Thank you for shopping with {BRAND.fullName}. Your order is being processed and will be delivered soon.
        </p>

        {order && (
          <div className="card text-left mb-10 p-8 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <span className="text-gray-500 font-medium">Order ID</span>
              <span className="font-mono font-bold text-gray-900">#{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Total Paid</span>
              <span className="text-2xl font-black text-emerald-600">Rs. {order.totalPrice}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Payment</span>
              <span className="font-bold text-gray-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Status</span>
              <span className="badge badge-pending capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Items</span>
              <span className="font-bold">{order.orderItems?.length || 0} products</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/order/${id}`} className="btn-primary inline-flex items-center justify-center gap-2 py-4">
            <Package className="w-5 h-5" /> View Order Details
          </Link>
          <Link to="/medicines" className="btn-secondary inline-flex items-center justify-center gap-2 py-4">
            Continue Shopping <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-4 text-gray-600 font-bold hover:text-emerald-600">
            <Home className="w-5 h-5" /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;

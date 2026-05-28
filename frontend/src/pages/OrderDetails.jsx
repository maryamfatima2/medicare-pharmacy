import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { 
  Package, MapPin, Truck, CreditCard, 
  Clock, CheckCircle, XCircle, ArrowLeft, Loader2, Printer
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-20 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (!order) return <div className="container mx-auto px-4 py-20 text-center">Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-bold transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Orders
        </Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-xl transition-colors">
          <Printer className="w-5 h-5" /> Print Invoice
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-2/3 space-y-8">
          {/* Order Status Card */}
          <div className="card p-8 bg-primary-900 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-primary-300 font-bold uppercase tracking-widest text-xs mb-2">Order Tracking</p>
              <h1 className="text-3xl font-black mb-4">Status: {order.status}</h1>
              <div className="flex items-center gap-4 text-sm text-primary-200">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Placed on {new Date(order.createdAt).toLocaleString()}</span>
                {order.isDelivered && <span className="flex items-center gap-1 text-green-400 font-bold"><CheckCircle className="w-4 h-4" /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>}
              </div>
            </div>
            <Package className="absolute -bottom-4 -right-4 w-32 h-32 text-primary-800 opacity-50 transform rotate-12" />
          </div>

          {/* Items */}
          <div className="card space-y-6">
            <h3 className="text-xl font-bold pb-4 border-b border-gray-50">Order Items</h3>
            <div className="divide-y divide-gray-50">
              {order.orderItems.map((item, i) => (
                <div key={i} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-2" />
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.quantity} x Rs. {item.price}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-lg">Rs. {item.quantity * item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:w-1/3 space-y-6">
          <div className="card p-8 space-y-6">
            <h3 className="text-xl font-bold pb-4 border-b border-gray-50">Delivery & Payment</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Shipping Address</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {order.shippingAddress.fullName}<br />
                    {order.shippingAddress.street}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CreditCard className="w-6 h-6 text-primary-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-gray-800">Payment Method</p>
                  <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                  <p className={`text-xs font-bold mt-1 ${order.isPaid ? 'text-green-600' : 'text-red-500'}`}>
                    {order.isPaid ? `Paid at ${new Date(order.paidAt).toLocaleString()}` : 'Payment Pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">Rs. {order.itemsPrice}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className="font-bold text-gray-900">Rs. {order.shippingPrice}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax</span>
                <span className="font-bold text-gray-900">Rs. {order.taxPrice}</span>
              </div>
              <div className="flex justify-between items-center pt-3 text-lg font-black text-primary-600">
                <span>Total</span>
                <span className="text-2xl">Rs. {order.totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-gray-50 border-gray-200">
            <h4 className="font-bold mb-2">Need help?</h4>
            <p className="text-sm text-gray-500 mb-4">If you have any questions regarding your order, please contact our support team.</p>
            <Link to="/contact" className="text-primary-600 font-bold hover:underline">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

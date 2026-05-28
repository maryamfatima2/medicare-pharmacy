import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-primary-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-12 h-12 text-primary-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Browse our medicines to get started.</p>
        <Link to="/medicines" className="btn-primary inline-flex items-center gap-2 px-10 py-4">
          Start Shopping <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Shopping Cart ({cartItems.length})</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items List */}
        <div className="lg:w-2/3 space-y-6">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => (
              <motion.div 
                key={item._id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center gap-6 group hover:shadow-md transition-shadow"
              >
                <Link to={`/medicine/${item._id}`} className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                </Link>
                
                <div className="flex-grow text-center sm:text-left">
                  <Link to={`/medicine/${item._id}`}>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-400 italic mb-2">{item.genericName}</p>
                  <p className="text-primary-600 font-bold">Rs. {item.discountPrice || item.price}</p>
                </div>

                <div className="flex items-center border border-gray-100 rounded-xl p-1 bg-gray-50">
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="w-24 text-right">
                  <p className="font-bold text-gray-900 text-lg">Rs. {(item.discountPrice || item.price) * item.quantity}</p>
                </div>

                <button 
                  onClick={() => removeFromCart(item._id)}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          
          <Link to="/medicines" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:underline py-2">
            <ArrowRight className="w-5 h-5 rotate-180" /> Continue Shopping
          </Link>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-28 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 pb-4 border-b border-gray-50">Order Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">Rs. {itemsPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className={`font-bold ${shippingPrice === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span className="font-bold text-gray-900">Rs. {taxPrice}</span>
              </div>
              {shippingPrice > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg text-center">
                  Add Rs. {Math.max(0, 2000 - itemsPrice)} more for FREE shipping!
                </p>
              )}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-3xl font-black text-primary-600">Rs. {totalPrice}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-3 gap-2 opacity-50 grayscale">
                <div className="flex justify-center p-2 bg-gray-50 rounded-lg"><CreditCard className="w-6 h-6" /></div>
                <div className="flex justify-center p-2 bg-gray-50 rounded-lg"><Truck className="w-6 h-6" /></div>
                <div className="flex justify-center p-2 bg-gray-50 rounded-lg"><ShieldCheck className="w-6 h-6" /></div>
              </div>
            </div>

            <div className="bg-primary-50 p-4 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-primary-800 leading-relaxed">
                By proceeding to checkout, you agree to our Terms of Service and Privacy Policy. All medicines are 100% genuine and verified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

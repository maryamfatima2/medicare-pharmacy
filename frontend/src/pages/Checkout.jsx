import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, Phone, User, Mail, Hash, ShieldCheck, Pill } from 'lucide-react';

const Checkout = () => {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'Cash on Delivery'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.discountPrice || item.price,
          medicine: item._id
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: subtotal > 2000 ? 0 : 150,
        totalPrice: subtotal + (subtotal > 2000 ? 0 : 150)
      };

      const { data } = await API.post('/orders', orderData);
      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Order placement failed');
    } finally {
      setLoading(false);
    }
  };

  const shippingPrice = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shippingPrice;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-gray-900 mb-10">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-primary-600" /> Shipping Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        required
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary-500 transition-colors"
                        placeholder="0300-1234567"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Street Address</label>
                  <input 
                    required
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-primary-500 transition-colors"
                    placeholder="House #, Street name, Area"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">City</label>
                    <input 
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Karachi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">State / Province</label>
                    <input 
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-primary-500 transition-colors"
                      placeholder="e.g. Sindh"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Zip Code</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        required
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:border-primary-500 transition-colors"
                        placeholder="75000"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-sm font-bold text-gray-600">Payment Method</label>
                  <div className="grid grid-cols-1 gap-4">
                    <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'Cash on Delivery' ? 'border-primary-600 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <Truck className="text-primary-600" />
                        <span className="font-bold">Cash on Delivery</span>
                      </div>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Cash on Delivery"
                        checked={formData.paymentMethod === 'Cash on Delivery'}
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                    <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'Card' ? 'border-primary-600 bg-primary-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <CreditCard className="text-primary-600" />
                        <span className="font-bold">Credit/Debit Card</span>
                      </div>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Card"
                        checked={formData.paymentMethod === 'Card'}
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {/* Card Payment Form (UI only) */}
                  {formData.paymentMethod === 'Card' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600">Card Number</label>
                        <input 
                          type="text"
                          required={formData.paymentMethod === 'Card'}
                          maxLength="19"
                          className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-primary-500 transition-colors tracking-widest"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-600">Expiry Date</label>
                          <input 
                            type="text"
                            required={formData.paymentMethod === 'Card'}
                            maxLength="5"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-primary-500 transition-colors"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-600">CVV</label>
                          <input 
                            type="password"
                            required={formData.paymentMethod === 'Card'}
                            maxLength="4"
                            className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-primary-500 transition-colors"
                            placeholder="123"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600">Name on Card</label>
                        <input 
                          type="text"
                          required={formData.paymentMethod === 'Card'}
                          className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-primary-500 transition-colors uppercase"
                          placeholder="JOHN DOE"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-200 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? 'Processing Order...' : `Place Order (Rs. ${total.toLocaleString()})`}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl p-2 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm">Rs. {((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping Fee</span>
                  <span className="text-white font-bold">
                    {shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice}`}
                  </span>
                </div>
                {shippingPrice > 0 && (
                  <p className="text-[10px] text-primary-400">Add Rs. {(2000 - subtotal).toLocaleString()} more for FREE shipping!</p>
                )}
                <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10 text-primary-400">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-8 bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex gap-3 items-center text-xs text-gray-400">
                  <ShieldCheck className="text-primary-500 w-5 h-5" />
                  <p>Your healthcare data is encrypted and secure. We follow strict medical privacy standards.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

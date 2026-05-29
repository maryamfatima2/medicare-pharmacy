import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Heart, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, Info, ClipboardList, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import MedicineImage from '../components/common/MedicineImage';

const MedicineDetails = () => {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/medicines/${id}`);
        setMedicine(data);
        
        // Save to recently viewed
        const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const updatedHistory = [{ _id: data._id, name: data.name, image: data.image, price: data.discountPrice || data.price }, ...history.filter(i => i._id !== data._id)].slice(0, 10);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedHistory));

        const relatedRes = await API.get(`/medicines/related/${id}`);
        setRelated(relatedRes.data);
      } catch (err) {
        toast.error('Failed to load medicine details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!medicine) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">Medicine not found</h2>
      <Link to="/medicines" className="text-primary-600 hover:underline mt-4 block">Back to Store</Link>
    </div>
  );

  const discount = medicine.discountPrice > 0 
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="card-dark rounded-3xl overflow-hidden mb-20 p-0">
        <div className="flex flex-col lg:flex-row">
          {/* Left: Image */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-navy-800/40 flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative group w-full max-w-md"
            >
              <MedicineImage
                name={medicine.name}
                image={medicine.image}
                categoryName={medicine.category?.name}
                alt={medicine.name}
                containerClass="aspect-square max-h-[420px] bg-navy-900/50 rounded-2xl"
                className="w-full h-full object-contain p-8 max-h-[420px]"
              />
              {discount > 0 && (
                <span className="absolute top-0 left-0 bg-red-500 text-white font-bold px-4 py-2 rounded-xl shadow-lg">
                  {discount}% OFF
                </span>
              )}
            </motion.div>
          </div>

          {/* Right: Info */}
          <div className="lg:w-1/2 p-8 lg:p-12 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                  {medicine.category?.name}
                </span>
                {medicine.requiresPrescription && (
                  <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <ClipboardList className="w-4 h-4" /> Prescription Required
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-extrabold text-white">{medicine.name}</h1>
              <p className="text-xl text-gray-500 italic font-medium">{medicine.genericName}</p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(medicine.averageRating || 4.5) ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-gray-600 font-bold">{medicine.averageRating || '4.5'}</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600 font-medium">{medicine.numReviews || '24'} Reviews</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600 font-medium">{medicine.soldCount || '150'}+ Sold</span>
              </div>
            </div>

            <div className="bg-navy-900/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm mb-1">Our Price</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-primary-400">
                    Rs. {medicine.discountPrice > 0 ? medicine.discountPrice : medicine.price}
                  </span>
                  {medicine.discountPrice > 0 && (
                    <span className="text-xl text-slate-500 line-through">Rs. {medicine.price}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold flex items-center gap-2 justify-end ${medicine.stock > 0 ? 'text-accent-400' : 'text-rose-500'}`}>
                  {medicine.stock > 0 ? <><ShieldCheck className="w-5 h-5" /> In Stock</> : <><Package className="w-5 h-5" /> Out of Stock</>}
                </p>
                <p className="text-slate-400 text-sm">{medicine.stock} units left</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center border border-white/10 rounded-xl bg-navy-950 p-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-navy-800 rounded-lg transition-colors text-slate-300"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-bold text-xl text-white">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-navy-800 rounded-lg transition-colors text-slate-300"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={() => addToCart(medicine, quantity)}
                disabled={medicine.stock <= 0}
                className="flex-grow btn-primary py-4 px-8 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
              >
                <ShoppingCart className="w-6 h-6" /> Add to Cart
              </button>
              
              <button 
                onClick={() => toggleWishlist(medicine._id)}
                className={`p-4 rounded-xl border transition-all ${isInWishlist(medicine._id) ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 shadow-md' : 'border-white/10 text-slate-400 hover:text-rose-500'}`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist(medicine._id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Manufacturer</p>
                <p className="text-white font-semibold">{medicine.manufacturer || 'General Pharma'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Form</p>
                <p className="text-white font-semibold">{medicine.dosageForm}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Strength</p>
                <p className="text-white font-semibold">{medicine.strength || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Pack Size</p>
                <p className="text-white font-semibold">{medicine.packSize || 'Standard'}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1 flex items-center gap-3 p-4 bg-primary-500/5 rounded-2xl border border-primary-500/20">
                <Truck className="w-6 h-6 text-primary-400" />
                <div>
                  <p className="text-white font-bold text-sm">Free Delivery</p>
                  <p className="text-slate-400 text-xs">On orders over Rs. 2000</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-3 p-4 bg-accent-500/5 rounded-2xl border border-accent-500/20">
                <RotateCcw className="w-6 h-6 text-accent-400" />
                <div>
                  <p className="text-white font-bold text-sm">7 Day Returns</p>
                  <p className="text-slate-400 text-xs">Original packing required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Description */}
      <div className="mb-20">
        <div className="flex border-b border-white/10 mb-8">
          <button className="border-b-4 border-primary-500 px-8 py-4 font-bold text-white">Description & Usage</button>
          <button className="px-8 py-4 font-bold text-slate-400 hover:text-white transition-colors">Side Effects</button>
          <button className="px-8 py-4 font-bold text-slate-400 hover:text-white transition-colors">Reviews ({medicine.numReviews || 0})</button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-primary-400" /> Product Overview
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {medicine.description}
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <ClipboardList className="w-6 h-6 text-primary-400" /> Usage Instructions
              </h3>
              <p className="text-slate-300 leading-relaxed bg-navy-900/50 p-6 rounded-2xl border-l-4 border-primary-500 border border-white/5">
                {medicine.usageInstructions || "Consult your physician for personalized dosage instructions. Generally taken with water before or after meals as prescribed."}
              </p>
            </div>
          </div>
          
          <aside className="card-dark p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-white">Safety Information</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-red-500/10 p-1 rounded-full mt-1"><Info className="w-4 h-4 text-red-500" /></div>
                <p className="text-sm text-slate-300">Keep out of reach of children.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-1 rounded-full mt-1"><Info className="w-4 h-4 text-amber-500" /></div>
                <p className="text-sm text-slate-300">Store in a cool, dry place away from sunlight.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-blue-500/10 p-1 rounded-full mt-1"><Info className="w-4 h-4 text-blue-500" /></div>
                <p className="text-sm text-slate-300">Do not exceed the recommended dose.</p>
              </li>
            </ul>
          </aside>
        </div>
      </div>
      {/* Related Products */}
      {related.length > 0 && (
        <section className="pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-white">Related Products</h2>
            <Link to="/medicines" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {related.map(item => (
              <Link key={item._id} to={`/medicine/${item._id}`} className="group">
                <div className="card-dark bg-navy-900/50 p-6 hover:shadow-glow transition-all duration-300">
                  <div className="aspect-square bg-navy-950/60 rounded-2xl p-4 mb-4 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">{item.name}</h4>
                  <p className="text-xs text-slate-400 mb-2">{item.genericName}</p>
                  <p className="text-primary-400 font-black">Rs. {item.discountPrice || item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {(() => {
        const history = JSON.parse(localStorage.getItem('recentlyViewed') || '[]').filter(item => item._id !== id).slice(0, 4);
        if (history.length === 0) return null;
        return (
          <section className="pt-12 mt-12 border-t border-white/10">
            <h2 className="text-3xl font-black text-white mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {history.map(item => (
                <Link key={item._id} to={`/medicine/${item._id}`} className="group">
                  <div className="card-dark bg-navy-900/50 p-6 hover:shadow-glow transition-all duration-300">
                    <div className="aspect-square bg-navy-950/60 rounded-2xl p-4 mb-4 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h4 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary-400 transition-colors">{item.name}</h4>
                    <p className="text-accent-400 font-black">Rs. {item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })()}
    </div>
  );
};

export default MedicineDetails;

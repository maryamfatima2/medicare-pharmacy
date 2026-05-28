import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, ShieldCheck, Clock, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion } from 'framer-motion';
import MedicineImage from '../common/MedicineImage';
import toast from 'react-hot-toast';

const MedicineCard = ({ medicine }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFav = isInWishlist(medicine._id);
  const hasDiscount = medicine.discountPrice > 0;
  const pct = hasDiscount
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100)
    : 0;

  const handleAdd = () => {
    addToCart(medicine);
    toast.success(`${medicine.name} added to cart`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full border-2 border-slate-200 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-400 bg-white dark:bg-navy-800 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl"
    >
      <div className="relative">
        <MedicineImage
          name={medicine.name}
          image={medicine.image}
          categoryName={medicine.category?.name}
          alt={`${medicine.name} - ${medicine.genericName}`}
          containerClass="aspect-[4/3] bg-slate-50 dark:bg-navy-900/50"
          className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && <span className="badge badge-off">{pct}% OFF</span>}
          {medicine.requiresPrescription && <span className="badge badge-rx">Rx</span>}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(medicine._id)}
          className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all ${
            isFav ? 'bg-rose-500 text-white shadow-md' : 'bg-white/80 dark:bg-navy-950/60 text-slate-500 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/medicine/${medicine._id}`} className="flex-grow">
          <p className="text-[10px] text-primary-600 dark:text-primary-400 font-bold uppercase tracking-widest mb-1">
            {medicine.category?.name || 'General'}
          </p>
          <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors">
            {medicine.name}
          </h3>
          <p className="text-slate-500 text-xs mt-1 line-clamp-1">{medicine.genericName}</p>
        </Link>

        <div className="flex items-center justify-between mt-3 mb-4">
          <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            {medicine.averageRating || '4.5'}
          </div>
          {medicine.stock > 0 ? (
            <span className="text-accent-600 dark:text-accent-400 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> In Stock
            </span>
          ) : (
            <span className="text-rose-500 dark:text-rose-400 text-xs font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Out of Stock
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-slate-400 dark:text-slate-500 text-xs line-through block">Rs. {medicine.price}</span>
                <span className="text-primary-600 dark:text-primary-300 font-black text-xl">Rs. {medicine.discountPrice}</span>
              </>
            ) : (
              <span className="text-slate-900 dark:text-white font-black text-xl">Rs. {medicine.price}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={medicine.stock <= 0}
            className="flex items-center gap-1.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed shadow-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
            <ShoppingCart className="w-4 h-4 sm:hidden" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default MedicineCard;

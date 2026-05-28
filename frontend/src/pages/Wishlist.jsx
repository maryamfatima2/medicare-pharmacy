import { useWishlist } from '../context/WishlistContext';
import MedicineCard from '../components/medicine/MedicineCard';
import { Heart, ArrowRight, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900">My Wishlist</h1>
          <p className="text-gray-500">Items you've saved for later.</p>
        </div>
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Heart className="w-5 h-5 fill-current" /> {wishlist.length} Items
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="card text-center py-20 bg-gray-50 border-dashed border-2">
          <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Heart className="w-12 h-12 text-gray-200" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Wishlist is Empty</h2>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Found something you like? Tap the heart icon to save it here!</p>
          <Link to="/medicines" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Discover Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {wishlist.map((item) => (
              <MedicineCard key={typeof item === 'string' ? item : item._id} medicine={item} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Wishlist;

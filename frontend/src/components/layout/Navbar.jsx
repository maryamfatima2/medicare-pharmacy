import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, Search, Menu, X, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api/axios';
import { getMedicineImage } from '../../constants/medicineImages';
import Logo from '../brand/Logo';
import CategoryDropdown from './CategoryDropdown';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { wishlist } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const { data } = await API.get(`/medicines/search/suggestions?q=${searchQuery}`);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Suggestions error', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/medicines?search=${searchQuery}`);
      setSearchQuery('');
      setShowSuggestions(false);
      setIsOpen(false);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className={`glass-nav transition-all duration-300 ${isScrolled ? 'py-2 shadow-glow' : 'py-3'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 lg:gap-4">
          <Logo size="md" showTagline />

          <CategoryDropdown />

          <div className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search medicines, brands, generics..."
                className="w-full bg-slate-100 dark:bg-navy-900/90 border border-slate-200 dark:border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 outline-none transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-3 text-slate-400 dark:text-slate-500 w-4 h-4" />
            </form>
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-glass overflow-hidden z-[100]"
                >
                  {suggestions.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => {
                        navigate(`/medicine/${item._id}`);
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-primary-500/10 text-left transition-colors"
                    >
                      <img src={getMedicineImage(item.name, item.image)} alt="" className="w-10 h-10 object-contain rounded-lg bg-slate-100 dark:bg-navy-800 p-1" />
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-xs text-primary-600 dark:text-primary-400">Rs. {item.discountPrice || item.price}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-auto">
            <Link to="/medicines" className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 font-semibold text-sm transition-colors">Medicines</Link>
            <Link to="/about" className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 font-semibold text-sm transition-colors">About</Link>
            <Link to="/contact" className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 font-semibold text-sm transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button type="button" onClick={toggleDarkMode} aria-label="Toggle Theme" aria-pressed={darkMode} className="theme-toggle">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/wishlist" className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-rose-500 dark:hover:text-rose-400 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">{wishlist.length}</span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-300 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
            {user ? (
              <div className="relative group hidden md:block">
                <button type="button" className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-white/10 hover:border-primary-400 dark:hover:border-primary-500/30 transition-all">
                  <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-glass opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                  {isAdmin && <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-300"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>}
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-300">Profile</Link>
                  <Link to="/orders" className="flex items-center gap-2 px-4 py-2.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-300">Orders</Link>
                  <hr className="border-slate-100 dark:border-white/5 my-1" />
                  <button type="button" onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"><LogOut className="w-4 h-4" /> Logout</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4 whitespace-nowrap">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4 whitespace-nowrap hidden sm:inline-block">Sign Up</Link>
              </div>
            )}
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-600 dark:text-slate-300" aria-label="Menu">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="lg:hidden border-t border-slate-200 dark:border-white/5 bg-white/95 dark:bg-navy-950/95 overflow-hidden">
            <div className="px-4 py-5 space-y-4">
              <form onSubmit={handleSearch} className="relative">
                <input type="text" placeholder="Search medicines..." className="input-field pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Search className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
              </form>
              <div className="grid grid-cols-2 gap-2">
                <Link onClick={() => setIsOpen(false)} to="/medicines" className="text-center py-3 bg-slate-100 dark:bg-navy-800 rounded-xl font-semibold text-slate-900 dark:text-slate-200 transition-colors">Medicines</Link>
                <Link onClick={() => setIsOpen(false)} to="/cart" className="text-center py-3 bg-slate-100 dark:bg-navy-800 rounded-xl font-semibold text-slate-900 dark:text-slate-200 transition-colors">Cart ({cartCount})</Link>
              </div>
              {!user ? (
                <div className="flex gap-2">
                  <Link onClick={() => setIsOpen(false)} to="/login" className="flex-1 text-center btn-outline py-3">Login</Link>
                  <Link onClick={() => setIsOpen(false)} to="/register" className="flex-1 text-center btn-primary py-3">Sign Up</Link>
                </div>
              ) : (
                <button type="button" onClick={() => { logout(); setIsOpen(false); }} className="w-full py-3 text-rose-400 font-bold">Logout</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Heart, ShoppingCart } from 'lucide-react';
import Logo from '../brand/Logo';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories for header:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="glass-nav bg-white/90 dark:bg-navy-900/80 border-b border-slate-200 dark:border-white/5 relative z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center space-x-2">
          <Logo size="md" showTagline={false} />
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <div 
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <Link to="/categories" className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors">
              Categories <ChevronDown className="w-4 h-4" />
            </Link>
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-navy-800 rounded-xl shadow-xl border border-slate-100 dark:border-white/10 overflow-hidden py-2 animate-slide-up">
                {categories.length > 0 ? categories.slice(0, 10).map((cat) => (
                  <Link 
                    key={cat._id} 
                    to={`/medicines?category=${cat._id}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-navy-700 text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <span className="text-xl">{cat.icon || '💊'}</span>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </Link>
                )) : (
                  <div className="px-4 py-3 text-sm text-slate-500">Loading categories...</div>
                )}
                <div className="border-t border-slate-100 dark:border-white/10 mt-2">
                  <Link 
                    to="/medicines" 
                    className="block px-4 py-3 text-center text-sm font-bold text-primary-600 dark:text-primary-400 hover:bg-slate-50 dark:hover:bg-navy-700 transition-colors"
                  >
                    View All Medicines
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <Link to="/medicines" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors">Medicines</Link>
          <Link to="/about" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors">About</Link>
          <Link to="/contact" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 font-medium transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link to="/wishlist" className="relative text-slate-600 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors" aria-label="Favorites">
            <Heart className="w-5 h-5" />
          </Link>
          <Link to="/cart" className="relative text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-300 transition-colors" aria-label="Cart">
            <ShoppingCart className="w-5 h-5" />
          </Link>
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-white/10 hover:border-primary-400 dark:hover:border-primary-500/30 transition-all">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold uppercase">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden sm:inline-block text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                  {user.name || user.email}
                </span>
              </button>
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-glass opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 py-2">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Dashboard</Link>
                )}
                <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Profile</Link>
                <Link to="/orders" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Orders</Link>
                <button type="button" onClick={logout} className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">Logout</button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm py-2 px-4">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

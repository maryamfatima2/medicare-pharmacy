import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import MedicineCard from '../components/medicine/MedicineCard';
import { MedicineCardSkeleton } from '../components/common/Skeleton';
import { Filter, Search, ChevronLeft, ChevronRight, SlidersHorizontal, PackageX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicineList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filters state from URL
  const page = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category')?.trim() || '';
  const search = searchParams.get('search')?.trim() || '';
  const sort = searchParams.get('sort') || 'newest';
  const limit = 12;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const params = { page, limit };
        if (category) params.category = category;
        if (search) params.search = search;
        if (sort) params.sort = sort;
        const { data } = await API.get('/medicines', { params });
        const medicinesResponse = Array.isArray(data)
          ? data
          : data.medicines || data.products || [];

        setMedicines(medicinesResponse);
        setPages(Number.isInteger(data.pages) ? data.pages : Math.max(1, Math.ceil(medicinesResponse.length / limit)));
        setTotal(Number.isInteger(data.total) ? data.total : medicinesResponse.length);

        // Fallback: if no medicines were returned and there are no active filters,
        // attempt to fetch a larger unfiltered list to ensure the page shows products.
        if (medicinesResponse.length === 0 && !category && !search) {
          try {
            const fallback = await API.get('/medicines', { params: { page: 1, limit: 100 } });
            const fallbackArr = Array.isArray(fallback.data)
              ? fallback.data
              : fallback.data.medicines || fallback.data.products || [];
            if (fallbackArr.length > 0) {
              setMedicines(fallbackArr);
              setPages(Number.isInteger(fallback.data.pages) ? fallback.data.pages : Math.max(1, Math.ceil(fallbackArr.length / limit)));
              setTotal(Number.isInteger(fallback.data.total) ? fallback.data.total : fallbackArr.length);
            }
          } catch (e) {
            console.error('Fallback fetch error', e);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
    window.scrollTo(0, 0);
  }, [page, category, search, sort]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', 1); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  return (
        <div className="container mx-auto px-4 py-12 text-white">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">
            {search ? `Results for "${search}"` : category ? `Category: ${categories.find((cat) => cat._id === category)?.name || 'Selected Category'}` : 'Pharmacy Store'}
          </h1>
          <p className="text-gray-500 mt-1">
            {category && !search ? `Browse ${categories.find((cat) => cat._id === category)?.name || 'this category'} medicines.` : `Showing ${medicines.length} of ${total} products`}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative flex-grow md:w-64">
            <input 
              type="text" 
              placeholder="Search products..."
              className="input-field pl-10"
              value={search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border flex items-center gap-2 md:hidden ${showFilters ? 'bg-primary-600 text-white border-primary-600' : 'bg-navy-800 text-slate-300 border-white/10'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar Filters */}
        <aside className={`lg:w-1/4 space-y-8 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="card-dark p-6 sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary-600" /> Filters
              </h3>
              {(category || sort !== 'newest') && (
                <button 
                  onClick={() => setSearchParams({})} 
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Sort By</label>
              <select 
                className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500 outline-none text-slate-100"
                value={sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="newest" className="bg-navy-900 text-slate-100">Newest Arrivals</option>
                <option value="bestselling" className="bg-navy-900 text-slate-100">Best Sellers</option>
                <option value="price_asc" className="bg-navy-900 text-slate-100">Price: Low to High</option>
                <option value="price_desc" className="bg-navy-900 text-slate-100">Price: High to Low</option>
                <option value="rating" className="bg-navy-900 text-slate-100">Top Rated</option>
              </select>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">Categories</label>
              <div className="space-y-2">
                <button 
                  onClick={() => handleFilterChange('category', '')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${!category ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 text-primary-400 font-bold' : 'hover:bg-navy-800 text-slate-400 hover:text-white'}`}
                >
                  All Products
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat._id}
                    onClick={() => handleFilterChange('category', cat._id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${category === cat._id ? 'bg-gradient-to-r from-primary-600/20 to-accent-600/20 border border-primary-500/30 text-primary-400 font-bold' : 'hover:bg-navy-800 text-slate-400 hover:text-white'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span> {cat.name}
                    </span>
                    <span className="text-xs text-gray-400">{cat.productCount}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <MedicineCardSkeleton key={i} />
              ))}
            </div>
          ) : medicines.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <AnimatePresence mode="popLayout">
                  {medicines.map((medicine) => (
                    <MedicineCard key={medicine._id} medicine={medicine} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center items-center gap-4 py-8">
                  <button 
                    disabled={parseInt(page) === 1}
                    onClick={() => handleFilterChange('page', parseInt(page) - 1)}
                    className="p-3 rounded-xl border border-white/10 bg-navy-800 text-slate-300 hover:border-primary-500 disabled:opacity-30 disabled:hover:border-white/10 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    {[...Array(pages).keys()].map(x => (
                      <button 
                        key={x + 1}
                        onClick={() => handleFilterChange('page', x + 1)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${parseInt(page) === x + 1 ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-glow' : 'bg-navy-800 border border-white/10 text-slate-300 hover:border-primary-500'}`}
                      >
                        {x + 1}
                      </button>
                    ))}
                  </div>
                  <button 
                    disabled={parseInt(page) === pages}
                    onClick={() => handleFilterChange('page', parseInt(page) + 1)}
                    className="p-3 rounded-xl border border-white/10 bg-navy-800 text-slate-300 hover:border-primary-500 disabled:opacity-30 disabled:hover:border-white/10 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          ) : (
             <div className="card-dark rounded-3xl p-20 text-center border border-dashed border-white/10 bg-navy-900/40">
               <div className="bg-navy-950 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                 <PackageX className="w-12 h-12 text-slate-600" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">No Medicines Found</h3>
               <p className="text-slate-400 mb-8 max-w-sm mx-auto">We couldn't find any products matching your search criteria. Try a different term or clear filters.</p>
               <button 
                 onClick={() => setSearchParams({})}
                 className="btn-primary"
               >
                 Clear All Filters
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineList;

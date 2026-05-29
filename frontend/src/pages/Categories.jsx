import { useState, useEffect } from 'react';
import API from '../api/axios';
import CategoriesGrid from '../components/home/CategoriesGrid';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-white">Browse Categories</h1>
        <p className="text-gray-500 mt-2 max-w-2xl">Discover products by category and jump directly into the medicines you need.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 rounded-3xl bg-slate-900/60 animate-pulse" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <CategoriesGrid categories={categories} />
      ) : (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No categories available</h2>
          <p className="text-gray-500">Try again later or add categories from the admin dashboard.</p>
        </div>
      )}
    </div>
  );
};

export default Categories;

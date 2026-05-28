/**
 * Dynamic local images resolution.
 * Loads all images from src/assets/medicines using Vite's import.meta.glob
 */

const localImages = import.meta.glob('/src/assets/medicines/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' });

// Map local file names (without extension) to their URLs
const imageMap = {};
for (const path in localImages) {
  const filename = path.split('/').pop().split('.')[0].toLowerCase();
  imageMap[filename] = localImages[path];
}

const CATEGORY_FALLBACK = {
  'Pain Relief': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=600&fit=crop&q=85',
  Antibiotics: 'https://images.unsplash.com/photo-1471864190281-ad5f9f33d70e?w=600&h=600&fit=crop&q=85',
  'Vitamins & Supplements': 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=600&h=600&fit=crop&q=85',
  'Skin Care': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&q=85',
  'Cough & Cold': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&h=600&fit=crop&q=85',
  'Diabetes Care': 'https://images.unsplash.com/photo-1615461066841-6116ecaaba30?w=600&h=600&fit=crop&q=85',
  'Heart Health': 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&h=600&fit=crop&q=85',
  'Digestive Health': 'https://images.unsplash.com/photo-1612196173975-45dc84117480?w=600&h=600&fit=crop&q=85',
  'Eye & Ear Care': 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=600&h=600&fit=crop&q=85',
  'First Aid': 'https://images.unsplash.com/photo-1626367305666-a4ed71374212?w=600&h=600&fit=crop&q=85',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1587854692152-c3f8f5b3d5c4?w=600&h=600&fit=crop&q=85';

// Format medicine name for URL lookup (e.g. "Panadol Extra" -> "panadol-extra")
const formatName = (name) => {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
};

export const getMedicineImage = (name, fallback, categoryName) => {
  const formattedName = formatName(name);
  if (formattedName && imageMap[formattedName]) {
    return imageMap[formattedName];
  }
  
  if (fallback && fallback.startsWith('http') && !fallback.includes('wikimedia')) {
    return fallback;
  }
  
  if (categoryName && CATEGORY_FALLBACK[categoryName]) {
    return CATEGORY_FALLBACK[categoryName];
  }
  
  return DEFAULT_IMAGE;
};

export const getMedicineFallbacks = (name, categoryName) => {
  const formattedName = formatName(name);
  const list = [
    formattedName && imageMap[formattedName],
    categoryName && CATEGORY_FALLBACK[categoryName],
    DEFAULT_IMAGE,
  ].filter(Boolean);
  return [...new Set(list)];
};

import { motion } from 'framer-motion';
import { getMedicineImage } from '../../constants/medicineImages';

const items = [
  { src: getMedicineImage('Vitamin C 1000mg'), x: '8%', y: '12%' },
  { src: getMedicineImage('Glucophage 500'), x: '50%', y: '5%' },
  { src: getMedicineImage('Corex-D Syrup'), x: '4%', y: '58%' },
];

const FloatingMedicines = () => (
  <div className="absolute inset-0 pointer-events-none">
    {items.map((item, i) => (
      <motion.div
        key={i}
        className="absolute w-[72px] h-[72px] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 shadow-glass bg-white/80 dark:bg-navy-900/50 backdrop-blur-sm"
        style={{ left: item.x, top: item.y }}
        animate={{ y: [0, -16, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
      >
        <img src={item.src} alt="" className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
    ))}
  </div>
);

export default FloatingMedicines;

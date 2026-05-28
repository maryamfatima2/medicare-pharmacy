import { useState, useMemo } from 'react';
import { Pill } from 'lucide-react';
import { getMedicineImage, getMedicineFallbacks } from '../../constants/medicineImages';

const MedicineImage = ({
  name,
  image,
  categoryName,
  alt,
  className = 'w-full h-full object-contain p-4',
  containerClass = 'aspect-square bg-slate-100 dark:bg-navy-800/50',
}) => {
  const sources = useMemo(() => {
    const primary = getMedicineImage(name, image, categoryName);
    const rest = getMedicineFallbacks(name, categoryName).filter((s) => s !== primary);
    return [primary, ...rest];
  }, [name, image, categoryName]);

  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed || idx >= sources.length) {
    return (
      <div className={`${containerClass} flex flex-col items-center justify-center bg-slate-50 dark:bg-navy-800/80`}>
        <Pill className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-2" />
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">No Image</span>
      </div>
    );
  }

  return (
    <div className={`${containerClass} overflow-hidden relative`}>
      <img
        src={sources[idx]}
        alt={alt || name || 'Medicine'}
        className={className}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (idx < sources.length - 1) setIdx((i) => i + 1);
          else setFailed(true);
        }}
      />
    </div>
  );
};

export default MedicineImage;

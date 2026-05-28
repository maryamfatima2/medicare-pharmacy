const ProductSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card-product animate-pulse p-0 overflow-hidden bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10">
        <div className="aspect-[4/3] bg-slate-200 dark:bg-navy-800/80" />
        <div className="p-5 space-y-3">
          <div className="h-3 bg-slate-200 dark:bg-navy-700 rounded w-1/4" />
          <div className="h-4 bg-slate-200 dark:bg-navy-700 rounded w-3/4" />
          <div className="h-3 bg-slate-100 dark:bg-navy-800 rounded w-1/2" />
          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-white/5">
            <div className="h-6 bg-slate-200 dark:bg-navy-700 rounded w-20" />
            <div className="h-10 bg-slate-300 dark:bg-navy-700 rounded-xl w-24" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ProductSkeleton;

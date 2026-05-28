import React from 'react';

export const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-navy-700 rounded-xl ${className}`}></div>
  );
};

export const MedicineCardSkeleton = () => {
  return (
    <div className="card p-4 space-y-4">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
};

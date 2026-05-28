const PageLoader = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="relative w-14 h-14">
      <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
    </div>
    <p className="text-gray-500 font-medium text-sm">{label}</p>
  </div>
);

export default PageLoader;

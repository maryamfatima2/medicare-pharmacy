import { Link } from 'react-router-dom';
import { BRAND } from '../../constants/brand';

const LogoIcon = ({ size = 40, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <defs>
      <linearGradient id="healoraGrad" x1="0" y1="0" x2="48" y2="48">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="14" fill="url(#healoraGrad)" />
    <path
      d="M24 10c-5 0-8 3-8 8v5h-3v6h3v11h6V29h4v-6h-4v-5c0-2.5 2-4.5 4.5-4.5S31 15.5 31 18v5h-4v6h4v11h6V29h3v-6h-3v-5c0-5-3-8-8-8z"
      fill="white"
    />
    <path
      d="M10 28c4-3 8-4 14-4s10 1 14 4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.5"
    />
    <circle cx="36" cy="14" r="3" fill="white" opacity="0.9" />
  </svg>
);

const Logo = ({ linked = true, size = 'md', showTagline = false, className = '' }) => {
  const sizes = { sm: 32, md: 40, lg: 52 };
  const iconSize = sizes[size] || sizes.md;

  const content = (
    <div className={`flex items-center gap-3 group ${className}`}>
      <div className="relative">
        <LogoIcon size={iconSize} className="drop-shadow-md group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-xl lg:text-2xl font-black tracking-tight">
          <span className="text-white">Heal</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-400">ora</span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Pharmacy
          </span>
        )}
      </div>
    </div>
  );

  if (linked) {
    return (
      <Link to="/" className="flex-shrink-0" aria-label={`${BRAND.fullName} home`}>
        {content}
      </Link>
    );
  }
  return content;
};

export { LogoIcon };
export default Logo;

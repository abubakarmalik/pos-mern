const base =
  'inline-flex min-h-9 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';

const variants = {
  primary: 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20 hover:bg-cyan-700 focus:ring-cyan-500',
  secondary:
    'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 focus:ring-slate-400',
  danger: 'bg-red-600 text-white shadow-sm shadow-red-600/20 hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-cyan-500',
  outline:
    'border border-cyan-200 bg-white text-cyan-700 shadow-sm hover:border-cyan-300 hover:bg-cyan-50 focus:ring-cyan-500',
};

const sizes = {
  sm: 'min-h-8 px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {loading && (
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
    )}
    {!loading && leftIcon && <span className="text-base leading-none">{leftIcon}</span>}
    {children}
    {!loading && rightIcon && <span className="text-base leading-none">{rightIcon}</span>}
  </button>
);

export default Button;

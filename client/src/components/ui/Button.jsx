const base =
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  />
);

export default Button;

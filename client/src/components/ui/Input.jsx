import { theme } from '../../theme/tokens';

const Input = ({ label, error, helperText, className = '', ...props }) => (
  <label className="block text-sm">
    {label && <span className={theme.form.label}>{label}</span>}
    <input
      className={`mt-1 ${theme.form.field} ${
        error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
      } ${className}`}
      aria-invalid={Boolean(error)}
      {...props}
    />
    {helperText && !error && <span className={theme.form.help}>{helperText}</span>}
    {error && <span className={theme.form.error}>{error}</span>}
  </label>
);

export default Input;

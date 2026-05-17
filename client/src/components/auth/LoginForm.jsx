import { useState } from 'react';
import { FiAlertCircle, FiEye, FiEyeOff, FiLock, FiLogIn, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { login } from '../../features/auth/authSlice';
import { selectAuthLoading } from '../../features/auth/authSelector';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await dispatch(login(form)).unwrap();
      navigate('/pos');
    } catch (errorResponse) {
      setError(errorResponse.message || 'Unable to sign in');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <FiAlertCircle className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      <label className="block text-sm">
        <span className="text-sm font-medium text-slate-700">Username</span>
        <div className="relative mt-1">
          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pl-10 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            type="text"
            name="username"
            value={form.username}
            onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            autoComplete="username"
            required
          />
        </div>
      </label>
      <label className="block text-sm">
        <span className="text-sm font-medium text-slate-700">Password</span>
        <div className="relative mt-1">
          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pl-10 pr-12 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="absolute inset-y-1 right-1 rounded-md px-3 text-base text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </label>
      <Button type="submit" className="w-full" loading={isLoading} leftIcon={<FiLogIn />}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;

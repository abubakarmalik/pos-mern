import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { login } from '../../features/auth/authSlice';
import { selectAuthLoading } from '../../features/auth/authSelector';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectAuthLoading);
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await dispatch(login(form)).unwrap();
      toast.success(response.message);
      navigate('/pos');
    } catch (errorResponse) {
      toast.error(errorResponse.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        type="text"
        name="username"
        value={form.username}
        onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
        required
      />
      <Input
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
        required
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;

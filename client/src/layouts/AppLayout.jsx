import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { logout } from '../features/auth/authSlice';
import { selectAuthLoading, selectUser } from '../features/auth/authSelector';

const navItems = [
  { to: '/pos', label: 'POS' },
  { to: '/sales', label: 'Sales' },
  { to: '/products', label: 'Products' },
  { to: '/categories', label: 'Categories', role: 'ADMIN' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/reports', label: 'Reports' },
  { to: '/users', label: 'Users', role: 'ADMIN' },
  { to: '/settings', label: 'Settings', role: 'ADMIN' },
];

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthLoading = useSelector(selectAuthLoading);
  const [open, setOpen] = useState(false);

  const filteredItems = navItems.filter(
    (item) => !item.role || item.role === user?.role,
  );

  const handleLogout = async () => {
    try {
      const response = await dispatch(logout()).unwrap();
      toast.success(response?.message || 'Logout successful');
      navigate('/login', { replace: true });
    } catch {
      toast.success('Logged out');
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            POS
          </h2>
          <button
            type="button"
            className="md:hidden text-slate-500"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-1 px-4 py-4">
          {filteredItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden text-slate-500"
          >
            ☰
          </button>
          <div>
            <p className="text-sm text-slate-500">Signed in as</p>
            <p className="text-sm font-medium text-slate-700">{user?.name}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isAuthLoading}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {isAuthLoading ? 'Logging out...' : 'Logout'}
          </button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

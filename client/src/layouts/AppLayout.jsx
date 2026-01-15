import { NavLink, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';

const navItems = [
  { to: '/pos', label: 'POS' },
  { to: '/sales', label: 'Sales' },
  { to: '/products', label: 'Products' },
  { to: '/inventory', label: 'Inventory' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings', role: 'ADMIN' },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const filteredItems = navItems.filter(
    (item) => !item.role || item.role === user?.role,
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Abubakar's POS
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
            onClick={logout}
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Logout
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

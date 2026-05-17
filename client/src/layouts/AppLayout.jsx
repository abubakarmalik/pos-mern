import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FiArchive,
  FiBarChart2,
  FiBox,
  FiChevronsLeft,
  FiChevronsRight,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShoppingCart,
  FiTag,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { selectAuthLoading, selectUser } from '../features/auth/authSelector';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const navItems = [
  { to: '/pos', label: 'POS', section: 'Register', icon: FiShoppingCart },
  { to: '/sales', label: 'Sales', section: 'Register', icon: FiGrid },
  { to: '/products', label: 'Products', section: 'Catalog', icon: FiBox },
  { to: '/categories', label: 'Categories', role: 'ADMIN', section: 'Catalog', icon: FiTag },
  { to: '/inventory', label: 'Inventory', section: 'Catalog', icon: FiArchive },
  { to: '/reports', label: 'Reports', section: 'Insights', icon: FiBarChart2 },
  { to: '/users', label: 'Users', role: 'ADMIN', section: 'Admin', icon: FiUsers },
  { to: '/settings', label: 'Settings', role: 'ADMIN', section: 'Admin', icon: FiSettings },
];

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthLoading = useSelector(selectAuthLoading);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('pos-sidebar-collapsed');
    setCollapsed(stored === 'true');
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem('pos-sidebar-collapsed', String(next));
      return next;
    });
  };

  const filteredItems = navItems.filter(
    (item) => !item.role || item.role === user?.role,
  );
  const groupedItems = filteredItems.reduce((groups, item) => {
    const section = item.section || 'General';
    return {
      ...groups,
      [section]: [...(groups[section] || []), item],
    };
  }, {});

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login', { replace: true });
    } catch {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen transform flex-col border-r border-slate-800 bg-slate-950 text-white shadow-xl transition-all duration-200 ease-out md:sticky md:top-0 md:translate-x-0 md:shadow-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'md:w-20' : 'w-72 md:w-72'}`}
      >
        <div className={`flex items-center justify-between border-b border-white/10 px-4 py-5 ${collapsed ? 'md:justify-center' : ''}`}>
          <div className={`min-w-0 ${collapsed ? 'md:hidden' : ''}`}>
            <h2 className="truncate text-lg font-semibold">POS Admin</h2>
            <p className="truncate text-xs text-slate-400">Retail operations</p>
          </div>
          {collapsed && (
            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-lg font-bold text-cyan-100 md:flex">
              P
            </div>
          )}
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-slate-300 hover:bg-white/10 md:hidden"
            onClick={() => setOpen(false)}
          >
            <FiX />
          </button>
        </div>
        <nav className={`flex-1 overflow-y-auto py-5 ${collapsed ? 'md:px-3' : 'px-4'}`}>
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} className="mb-5 last:mb-0">
              <p className={`mb-2 px-3 text-[11px] font-bold uppercase tracking-wide text-slate-500 ${collapsed ? 'md:sr-only' : ''}`}>
                {section}
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      title={collapsed ? item.label : undefined}
                      aria-label={item.label}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                          isActive
                            ? 'bg-cyan-400/15 text-cyan-100 ring-1 ring-inset ring-cyan-300/20'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      <Icon className="shrink-0 text-base" />
                      <span className={`${collapsed ? 'md:hidden' : ''}`}>
                        {item.label}
                      </span>
                      {collapsed && (
                        <span className="pointer-events-none absolute left-full z-50 ml-3 hidden rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 shadow-lg ring-1 ring-white/10 transition group-hover:opacity-100 md:block">
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 md:hidden"
            >
              <FiMenu />
              <span>Menu</span>
            </button>
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 md:inline-flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <FiChevronsRight /> : <FiChevronsLeft />}
            </button>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-cyan-100">
              {user?.name?.slice(0, 1) || 'U'}
            </div>
            <div>
              <p className="text-xs text-slate-500">Signed in as</p>
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setConfirmLogout(true)}
            loading={isAuthLoading}
            leftIcon={<FiLogOut />}
          >
            Logout
          </Button>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1440px] space-y-5">
            <Breadcrumb />
            <Outlet />
          </div>
        </main>
      </div>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-20 bg-slate-950/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <ConfirmDialog
        open={confirmLogout}
        title="Log out?"
        description="You will return to the sign in screen. Unsaved form changes on this device may be lost."
        confirmLabel="Log out"
        loadingLabel="Logging out..."
        variant="danger"
        loading={isAuthLoading}
        onCancel={() => setConfirmLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AppLayout;

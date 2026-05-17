import { Outlet } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';

const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-xl text-cyan-100">
          <FiShoppingBag />
        </div>
        <h1 className="text-2xl font-bold text-slate-950">POS Admin</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to manage sales and inventory.
        </p>
      </div>
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;

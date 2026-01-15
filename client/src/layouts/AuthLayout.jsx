import { Outlet } from 'react-router-dom';

const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-slate-800">
          Abubakar's Pos
        </h1>
        <p className="text-sm text-slate-500">Sign in to continue</p>
      </div>
      <Outlet />
    </div>
  </div>
);

export default AuthLayout;

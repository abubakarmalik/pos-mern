import LoginForm from '../features/auth/LoginForm';

const LoginPage = () => (
  <>
    <LoginForm />
    <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-500">
      <p className="font-semibold">Current logins</p>
      <p>admin@pos.com / Admin@123</p>
      <p>cashier@pos.com / Cashier@123</p>
    </div>
  </>
);

export default LoginPage;

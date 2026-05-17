import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      duration: 2800,
      style: {
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.14)',
        fontSize: '0.875rem',
      },
      success: { duration: 2200 },
      error: { duration: 4200 },
    }}
  />
);

export default Toast;

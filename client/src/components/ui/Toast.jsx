import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      style: { fontSize: '0.875rem' },
    }}
  />
);

export default Toast;

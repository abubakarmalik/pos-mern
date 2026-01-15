import { Toaster } from 'react-hot-toast';

const Toast = () => (
  <Toaster
    position="top-center"
    toastOptions={{
      style: { fontSize: '0.875rem' },
    }}
  />
);

export default Toast;

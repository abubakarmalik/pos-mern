import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthProvider';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import LoginPage from './pages/LoginPage';
import PosPage from './pages/PosPage';
import InvoicePage from './pages/InvoicePage';
import SalesListPage from './pages/SalesListPage';
import SaleDetailPage from './pages/SaleDetailPage';
import ProductsPage from './pages/ProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import InventoryPage from './pages/InventoryPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const RequireRole = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return null;
  if (!roles.includes(user.role)) return <Navigate to="/pos" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/pos" replace />} />
        <Route path="/pos" element={<PosPage />} />
        <Route path="/invoice/:saleId" element={<InvoicePage />} />
        <Route path="/sales" element={<SalesListPage />} />
        <Route path="/sales/:id" element={<SaleDetailPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route
          path="/products/new"
          element={
            <RequireRole roles={["ADMIN"]}>
              <ProductFormPage />
            </RequireRole>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <RequireRole roles={["ADMIN"]}>
              <ProductFormPage />
            </RequireRole>
          }
        />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route
          path="/settings"
          element={
            <RequireRole roles={["ADMIN"]}>
              <SettingsPage />
            </RequireRole>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/pos" replace />} />
    </Routes>
  );
}

export default App;

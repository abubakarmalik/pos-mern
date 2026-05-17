import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import LoginPage from '../pages/LoginPage';
import PosPage from '../pages/PosPage';
import InvoicePage from '../pages/InvoicePage';
import SalesListPage from '../pages/SalesListPage';
import SaleDetailPage from '../pages/SaleDetailPage';
import ProductsPage from '../pages/ProductsPage';
import ProductFormPage from '../pages/ProductFormPage';
import CategoriesPage from '../pages/CategoriesPage';
import CategoryFormPage from '../pages/CategoryFormPage';
import InventoryPage from '../pages/InventoryPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';
import UsersPage from '../pages/UsersPage';
import UserFormPage from '../pages/UserFormPage';
import {
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
} from '../features/auth/authSelector';

const RequireAuth = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const RequireRole = ({ roles, children }) => {
  const user = useSelector(selectUser);

  if (!user) return null;
  if (!roles.includes(user.role)) return <Navigate to="/pos" replace />;
  return children;
};

const AppRoutes = () => (
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
        path="/categories"
        element={
          <RequireRole roles={['ADMIN']}>
            <CategoriesPage />
          </RequireRole>
        }
      />
      <Route
        path="/categories/new"
        element={
          <RequireRole roles={['ADMIN']}>
            <CategoryFormPage />
          </RequireRole>
        }
      />
      <Route
        path="/categories/:id/edit"
        element={
          <RequireRole roles={['ADMIN']}>
            <CategoryFormPage />
          </RequireRole>
        }
      />
      <Route
        path="/products/new"
        element={
          <RequireRole roles={['ADMIN']}>
            <ProductFormPage />
          </RequireRole>
        }
      />
      <Route
        path="/products/:id/edit"
        element={
          <RequireRole roles={['ADMIN']}>
            <ProductFormPage />
          </RequireRole>
        }
      />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route
        path="/users"
        element={
          <RequireRole roles={['ADMIN']}>
            <UsersPage />
          </RequireRole>
        }
      />
      <Route
        path="/users/new"
        element={
          <RequireRole roles={['ADMIN']}>
            <UserFormPage />
          </RequireRole>
        }
      />
      <Route
        path="/settings"
        element={
          <RequireRole roles={['ADMIN']}>
            <SettingsPage />
          </RequireRole>
        }
      />
    </Route>

    <Route path="*" element={<Navigate to="/pos" replace />} />
  </Routes>
);

export default AppRoutes;

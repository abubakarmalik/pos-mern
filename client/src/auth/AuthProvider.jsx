import { createContext, useContext, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../api/client';
import { clearAuthStorage, getAuthStorage, setAuthStorage } from './authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getAuthStorage());

  const { data, isLoading } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiFetch('/auth/me');
      return response.data.user;
    },
    enabled: Boolean(auth?.token),
  });

  const login = async (email, password) => {
    const response = await apiFetch('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setAuthStorage(response.data);
    setAuth(response.data);
    return response.data.user;
  };

  const logout = () => {
    clearAuthStorage();
    setAuth(null);
  };

  const value = useMemo(
    () => ({
      user: data || auth?.user || null,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      isLoading,
      login,
      logout,
    }),
    [auth, data, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

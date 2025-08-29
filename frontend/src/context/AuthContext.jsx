import { createContext, useState } from 'react';
import { login as loginService, logout as logoutService } from '@services/auth.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (credentials) => {
    const data = await loginService(credentials.email, credentials.password);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    return data;
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (_err) {
      // ignore logout errors
    }
    localStorage.removeItem('token');
    setToken(null);
    if (typeof window !== 'undefined') {
      window.location.assign('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, clearAuth, saveAuth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [authModal, setAuthModal] = useState(null);
  const navigate = useNavigate();

  const login = (userData, token) => {
    saveAuth(token, userData);
    setUser(userData);
    // Auto redirect theo role
    if (userData.role === 'admin') {
      navigate('/admin');
    } else if (userData.role === 'designer') {
      navigate('/designer');
    }
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authModal, setAuthModal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}

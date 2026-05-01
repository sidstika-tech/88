import React, { createContext, useContext, useState, useCallback } from 'react';

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('aibos_user')) || null; } catch { return null; }
  });

  const setAuth = useCallback((userData, token) => {
    localStorage.setItem('aibos_token', token);
    localStorage.setItem('aibos_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aibos_token');
    localStorage.removeItem('aibos_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('aibos_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setAuth, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

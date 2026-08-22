import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  employee: {
    id: 'EMP-2024-0142',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@northline.com',
    role: 'employee',
    avatar: null,
  },
  admin: {
    id: 'ADM-2024-0007',
    name: 'Priya Sharma',
    email: 'priya.sharma@northline.com',
    role: 'admin',
    avatar: null,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('auth_user');
    }
  }, []);

  const login = async (email, password, role) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Mock validation: succeed for demo, fail on "wrong" password
    if (password === 'wrong') {
      throw new Error('Invalid email or password');
    }

    const mockUser = {
      ...MOCK_USERS[role] || MOCK_USERS.employee,
      email: email,
      token: 'mock-jwt-' + Math.random().toString(36).slice(2),
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

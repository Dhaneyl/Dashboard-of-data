import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, User } from '../types';
import { sleep } from '../utils/helpers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('dashboard_user');
      if (savedUser) {
        await sleep(300); // Simulate network delay
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    try {
      setLoading(true);
      await sleep(800); // Simulate API call

      // Mock login - accept any credentials
      const loggedInUser: User = {
        ...MOCK_USER,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      };

      setUser(loggedInUser);
      localStorage.setItem('dashboard_user', JSON.stringify(loggedInUser));
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dashboard_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

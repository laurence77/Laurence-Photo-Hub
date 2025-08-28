import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  roles: string[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  const login = useCallback(async (email: string, password: string) => {
    // In production, client-side demo auth is disabled for security.
    if (import.meta.env.PROD) {
      // Always require real backend auth in production builds.
      return false;
    }

    // Development-only demo credentials
    const ok = email === 'laurence@laurence' && password === '12345';
    if (ok) {
      setIsAuthenticated(true);
      // Demo: grant admin + superadmin for this user
      setRoles(['admin', 'superadmin']);
    }
    return ok;
  }, []);

  const logout = useCallback(() => { setIsAuthenticated(false); setRoles([]); }, []);

  const value = useMemo(() => ({ isAuthenticated, roles, login, logout }), [isAuthenticated, roles, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

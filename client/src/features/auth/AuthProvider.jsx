import { useCallback, useEffect, useMemo, useState } from 'react';

import AuthContext from './AuthContext';
import authService from '../../services/auth.service';
import { onUnauthorized } from '../../services/api';

// status: 'loading' while /auth/me restores the session, then 'authenticated' or 'guest'
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  const clearSession = useCallback(() => {
    setUser(null);
    setStatus('guest');
  }, []);

  useEffect(() => {
    onUnauthorized(clearSession);

    let ignore = false;
    authService
      .me()
      .then((currentUser) => {
        if (!ignore) {
          setUser(currentUser);
          setStatus('authenticated');
        }
      })
      .catch(() => {
        if (!ignore) clearSession();
      });

    return () => {
      ignore = true;
    };
  }, [clearSession]);

  const login = useCallback(async (credentials) => {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    setStatus('authenticated');
  }, []);

  const register = useCallback(async (details) => {
    const newUser = await authService.register(details);
    setUser(newUser);
    setStatus('authenticated');
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      // Even if the request fails (e.g. the session already expired), the user is logged out locally
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === 'authenticated', login, register, logout }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

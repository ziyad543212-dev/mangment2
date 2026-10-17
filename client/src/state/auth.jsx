import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function signin(credentials) {
    const { data } = await api.post('/auth/signin', credentials);
    setUser(data.user);
  }

  async function signup(details) {
    const { data } = await api.post('/auth/signup', details);
    setUser(data.user);
  }

  async function signout() {
    await api.post('/auth/signout');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, signin, signup, signout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

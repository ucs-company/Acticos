import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { admin, tokenStore } from '@/services/admin';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!tokenStore.get()) { setReady(true); return; }
    admin.me().then(setUser).catch(() => tokenStore.clear()).finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await admin.login(email, password);
    tokenStore.set(token); setUser(u);
  }, []);
  const logout = useCallback(() => { tokenStore.clear(); setUser(null); }, []);

  return <Ctx.Provider value={{ user, ready, login, logout }}>{children}</Ctx.Provider>;
}

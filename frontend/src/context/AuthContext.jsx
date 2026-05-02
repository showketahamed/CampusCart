import { createContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      setUser(data.user);
      setVendor(data.vendor || null);
    } catch {
      setUser(null);
      setVendor(null);
      localStorage.removeItem("cc_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const login = async (payload) => {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("cc_token", data.token);
    await fetchProfile();
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    if (data.token) {
      localStorage.setItem("cc_token", data.token);
      await fetchProfile();
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("cc_token");
    setUser(null);
    setVendor(null);
  };

  const value = useMemo(() => ({ user, vendor, loading, login, register, logout, refresh: fetchProfile }), [user, vendor, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

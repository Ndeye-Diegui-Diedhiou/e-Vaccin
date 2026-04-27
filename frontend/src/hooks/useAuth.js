import { useState, useCallback } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      // Simulation API
      await new Promise(r => setTimeout(r, 1200));
      
      // Validation
      if (email === "admin@evaccin.sn" && password === "demo123") {
        const userData = {
          id: "usr_" + Date.now(),
          email,
          role,
          name: role === "agent" ? "Aminata Sall" : role === "medecin" ? "Dr. Moussa Diop" : "Admin Panel",
          avatar: role === "agent" ? "AS" : role === "medecin" ? "MD" : "AP",
          lastLogin: new Date(),
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } else {
        throw new Error("Identifiants invalides. Essayez admin@evaccin.sn / demo123");
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("user");
  }, []);

  const loadFromStorage = useCallback(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return { user, loading, error, login, logout, loadFromStorage };
}

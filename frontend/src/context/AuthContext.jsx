// src/context/AuthContext.jsx
// NAYI FILE - is context ko App.jsx mein sabse upar wrap karna hai
import { createContext, useContext, useState, useEffect } from "react";
import { fetchUserProfile } from "../Api/basicStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // App load hote hi silently check karo ki refresh-token cookie se
  // user already logged in hai ya nahi (bina kisi redirect ke)
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const profile = await fetchUserProfile(); // fail hone par null return karta hai, koi redirect nahi
      if (profile) setUser(profile);
      setAuthLoading(false);
    };
    init();
  }, []);

  const login = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, logout, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
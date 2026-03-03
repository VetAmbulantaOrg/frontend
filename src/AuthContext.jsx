import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVet, setIsVet] = useState(false);
  const [isHelp, setIsHelp] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const decodeAndSetUser = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);

      if (decoded.role?.includes("Veterinar")) {
        setIsVet(true);
        setRole("Veterinar");
      } else if (decoded.role?.includes("Pomocnik")) {
        setIsHelp(true);
        setRole("Pomocnik");
      } else {
        setRole(decoded.role ?? null);
      }

      console.log("Decoded user:", decoded);
    } catch (err) {
      console.error("Nevalidan token:", err);
      sessionStorage.removeItem("token");
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      decodeAndSetUser(token);
    }
    setLoading(false);
  }, []);

  // Navigacija na osnovu role – reaguje kad se role promeni
  useEffect(() => {
    if (isAuthenticated && role) {
      if (role === "Veterinar") {
        navigate("/appointments");
      } else if (role === "Pomocnik") {
        navigate("/patients");
      }
    }
  }, [isAuthenticated, role, navigate]);

  const login = (token) => {
    sessionStorage.setItem("token", token);
    decodeAndSetUser(token);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsVet(false);
    setIsHelp(false);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role,
        isVet,
        isHelp,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

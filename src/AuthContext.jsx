import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVet, setIsVet] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Provera tokena u AuthProvider:", token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        if (decoded.role && decoded.role.includes("Veterinar")) {
          setIsVet(true);
          setRole("Veterinar");
        } else {
          setIsVet(false);
          setRole(decoded.role);
        }

        console.log("Decoded user:", decoded);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Nevalidan token:", err);
        localStorage.removeItem("token");
      }
    }
  }, [localStorage.getItem("token")]);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsAuthenticated(true);

    if (decoded.role && decoded.role.includes("Veterinar")) {
      setIsVet(true);
      setRole("Veterinar");
    } else {
      setIsVet(false);
      setRole(decoded.role);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setIsVet(false);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, role, isVet, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

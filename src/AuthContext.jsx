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
  useEffect(() => {
    const token = sessionStorage.getItem("token");   // promenjeno na sessionStorage
    console.log("Provera tokena u AuthProvider:", token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);

        if (decoded.role && decoded.role.includes("Veterinar")) {
          setIsVet(true);
          setRole("Veterinar");
        } else if (decoded.role && decoded.role.includes("Pomocnik")) {
          setIsHelp(true);
          setRole("Pomocnik");
        } else {
          setRole(decoded.role);
        }

        console.log("Decoded user:", decoded);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Nevalidan token:", err);
        sessionStorage.removeItem("token");   // takođe sessionStorage
      }
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    sessionStorage.setItem("token", token);   // promenjeno na sessionStorage
    const decoded = jwtDecode(token);
    setUser(decoded);
    setIsAuthenticated(true);

    if (decoded.role && decoded.role.includes("Veterinar")) {
      setIsVet(true);
      setRole("Veterinar");
    } else if (decoded.role && decoded.role.includes("Pomocnik")) {
      setIsHelp(true);
      setRole("Pomocnik");
    } else {
      setRole(decoded.role);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("token");   // promenjeno na sessionStorage
    setIsAuthenticated(false);
    setIsVet(false);
    setIsHelp(false);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, role, isVet, isHelp, loading , login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import LoginPage from "./components/Login_Register/LoginForm.jsx";
import RegisterPage from "./components/Login_Register/RegisterForm.jsx";


const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  };
  
  export default AppRoutes;
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.jsx";
import "./styles/app.scss";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import { AuthProvider } from "./AuthContext.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <AppRoutes />
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

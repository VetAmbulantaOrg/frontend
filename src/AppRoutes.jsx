import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import PatientsTable from "./components/patients/patientsRender.jsx";
import PatientCreate from "./components/patientForms/patientFromCreate.jsx";
import PatientEdit from "./components/patientForms/patientFromEdit.jsx";
import LoginPage from "./components/Login_Register/LoginForm.jsx";
import RegisterPage from "./components/Login_Register/RegisterForm.jsx";


const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/patients" element={<PatientsTable />} />
        <Route path="/create-patient" element={<PatientCreate />} />
        <Route path="/edit-patient/:id" element={<PatientEdit />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  };
  
  export default AppRoutes;
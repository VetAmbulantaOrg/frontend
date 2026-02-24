import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import PatientsTable from "./components/patients/patientsRender.jsx";
import PatientCreate from "./components/patientForms/patientFromCreate.jsx";
import PatientEdit from "./components/patientForms/patientFromEdit.jsx";
import LoginPage from "./components/Login_Register/LoginForm.jsx";
import RegisterPage from "./components/Login_Register/RegisterForm.jsx";
import AppointmentsPage from "./components/appointmentCalendar/AppointmentsPage.jsx";
import UnauthorizedPage from "./security/UnauthorizedPage.jsx";
import ProtectedRoute from "./security/ProtectedRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />

      <Route
        path="/patients"
        element={
          <ProtectedRoute requiredRoles={["Veterinar", "Pomocnik"]}>
            <PatientsTable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-patient"
        element={
          <ProtectedRoute requiredRoles={["Veterinar", "Pomocnik"]}>
            <PatientCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-patient/:id"
        element={
          <ProtectedRoute requiredRoles={["Veterinar", "Pomocnik"]}>
            <PatientEdit />
          </ProtectedRoute>
        }
      />

      <Route
        path="/appointments"
        element={
          <ProtectedRoute requiredRoles={["Pomocnik"]}>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
    </Routes>
  );
};

export default AppRoutes;

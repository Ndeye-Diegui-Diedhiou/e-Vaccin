import { useState, useEffect } from "react";
import EVaccinLanding from "./e-vaccin-landing";
import EVaccinLogin from "./e-vaccin-login";
import { Dashboard } from "./pages/Dashboard";
import { PatientProfile } from "./pages/PatientProfile";
import { useAuth } from "./hooks/useAuth";

import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing"); // landing | login | dashboard | patient
  const { user, loading, loadFromStorage, logout } = useAuth();

  useEffect(() => {
    loadFromStorage();
  }, []);

  const handleNavToLogin = () => setCurrentPage("login");
  const handleNavToDashboard = () => setCurrentPage("dashboard");
  const handleNavToPatient = (id) => {
    setCurrentPage("patient");
  };
  const handleLogout = () => {
    logout();
    setCurrentPage("landing");
  };

  // Navbar for authenticated users
  const AuthNavbar = () => (
    <nav className="app-navbar">
      <div className="app-navbar-inner">
        <div className="app-logo">
          <span>e-Vaccin</span>
        </div>
        <div className="app-navbar-actions">
          <span className="app-user-info">
            {user?.avatar} {user?.name}
          </span>
          <button className="app-btn-logout" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="app">
      {user && <AuthNavbar />}

      {currentPage === "landing" && (
        <EVaccinLanding onLoginClick={handleNavToLogin} />
      )}

      {currentPage === "login" && (
        <EVaccinLogin onLoginSuccess={handleNavToDashboard} />
      )}

      {currentPage === "dashboard" && user && (
        <Dashboard user={user} onPatientClick={handleNavToPatient} />
      )}

      {currentPage === "patient" && user && (
        <PatientProfile patientId={1} onBack={() => setCurrentPage("dashboard")} />
      )}
    </div>
  );
}

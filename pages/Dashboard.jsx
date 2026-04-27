import { useState, useEffect } from "react";
import "./Dashboard.css";
import { Button } from "../components/Button";

export function Dashboard({ user }) {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Simulation data
    setStats({
      totalPatients: 1248,
      vaccined: 1089,
      pending: 159,
      avgAdhesion: 87.2,
    });

    setPatients([
      {
        id: 1,
        name: "Moussa Konaté",
        cni: "1234567890",
        age: 2,
        lastVaccine: "2025-04-15",
        status: "up-to-date",
        nextVaccine: "2025-06-20",
      },
      {
        id: 2,
        name: "Awa Diallo",
        cni: "0987654321",
        age: 5,
        lastVaccine: "2025-03-10",
        status: "pending",
        nextVaccine: "2025-05-10",
      },
      {
        id: 3,
        name: "Ibrahima Ndiaye",
        cni: "5555666777",
        age: 1,
        lastVaccine: "2025-04-01",
        status: "up-to-date",
        nextVaccine: "2025-05-01",
      },
    ]);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      "up-to-date": { bg: "#EAF3DE", color: "#3B6D11", label: "À jour" },
      pending: { bg: "#FCEBEB", color: "#E24B4A", label: "En attente" },
      vaccined: { bg: "#E6F1FB", color: "#185FA5", label: "Vacciné" },
    };
    return badges[status] || badges["vaccined"];
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="dashboard-subtitle">Bienvenue, {user?.name}</p>
        </div>
        <Button>Nouveau patient</Button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Patients enregistrés</div>
          <div className="stat-value">{stats?.totalPatients.toLocaleString()}</div>
          <div className="stat-trend">+12 cette semaine</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vaccinés à jour</div>
          <div className="stat-value">{stats?.vaccined}</div>
          <div className="stat-percent">{stats?.avgAdhesion}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">En attente</div>
          <div className="stat-value">{stats?.pending}</div>
          <div className="stat-trend">Rappels nécessaires</div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Patients récents</h2>
          <div className="section-filters">
            <button 
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Tous
            </button>
            <button 
              className={`filter-btn ${filter === "pending" ? "active" : ""}`}
              onClick={() => setFilter("pending")}
            >
              En attente
            </button>
          </div>
        </div>

        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>CNI</th>
              <th>Âge</th>
              <th>Dernière vaccination</th>
              <th>Statut</th>
              <th>Prochain rappel</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => {
              const badge = getStatusBadge(p.status);
              return (
                <tr key={p.id}>
                  <td className="patient-name">{p.name}</td>
                  <td>{p.cni}</td>
                  <td>{p.age} ans</td>
                  <td>{new Date(p.lastVaccine).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                  </td>
                  <td>{new Date(p.nextVaccine).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <Button variant="ghost" size="sm">Voir dossier</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

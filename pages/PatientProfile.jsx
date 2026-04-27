import { useState } from "react";
import "./PatientProfile.css";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";

export function PatientProfile({ patientId }) {
  const [patient, setPatient] = useState({
    id: 1,
    name: "Moussa Konaté",
    cni: "1234567890",
    age: 2,
    gender: "M",
    birthDate: "2023-02-15",
    phone: "+221 77 123 45 67",
    mother: "Aissatou Sall",
    address: "Kaolack, Sénégal",
    vaccines: [
      { id: 1, name: "BCG", date: "2023-02-20", lot: "LOT-001-BCG", agent: "Dr. Sow" },
      { id: 2, name: "Polio (1/3)", date: "2023-03-15", lot: "LOT-002-POLIO", agent: "Infirmière Awa" },
      { id: 3, name: "Polio (2/3)", date: "2023-04-15", lot: "LOT-003-POLIO", agent: "Dr. Sow" },
      { id: 4, name: "DTC (1/3)", date: "2023-05-10", lot: "LOT-004-DTC", agent: "Infirmière Awa" },
    ],
    nextVaccines: [
      { name: "Polio (3/3)", date: "2025-06-15", status: "pending" },
      { name: "DTC (2/3)", date: "2025-07-20", status: "pending" },
    ],
  });

  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [formData, setFormData] = useState({
    vaccine: "",
    date: "",
    lot: "",
  });

  const handleAddVaccine = () => {
    if (formData.vaccine && formData.date && formData.lot) {
      setPatient(prev => ({
        ...prev,
        vaccines: [
          ...prev.vaccines,
          {
            id: prev.vaccines.length + 1,
            name: formData.vaccine,
            date: formData.date,
            lot: formData.lot,
            agent: "Agent Courant",
          }
        ]
      }));
      setFormData({ vaccine: "", date: "", lot: "" });
      setShowAddVaccine(false);
    }
  };

  return (
    <div className="patient-profile">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-back">
          <button className="back-btn">← Retour</button>
        </div>
        <h1>Dossier patient</h1>
        <div className="profile-actions">
          <Button variant="ghost" size="sm">Imprimer</Button>
          <Button size="sm">Éditer</Button>
        </div>
      </div>

      {/* Patient Info */}
      <div className="profile-card">
        <div className="patient-info-header">
          <div className="patient-avatar">{patient.name.substring(0, 2)}</div>
          <div>
            <h2>{patient.name}</h2>
            <p className="patient-meta">{patient.age} ans • {patient.gender === "M" ? "Garçon" : "Fille"} • CNI: {patient.cni}</p>
          </div>
        </div>

        <div className="patient-info-grid">
          <div className="info-block">
            <span className="info-label">Date de naissance</span>
            <span className="info-value">{new Date(patient.birthDate).toLocaleDateString("fr-FR")}</span>
          </div>
          <div className="info-block">
            <span className="info-label">Mère/Tutrice</span>
            <span className="info-value">{patient.mother}</span>
          </div>
          <div className="info-block">
            <span className="info-label">Téléphone</span>
            <span className="info-value">{patient.phone}</span>
          </div>
          <div className="info-block">
            <span className="info-label">Adresse</span>
            <span className="info-value">{patient.address}</span>
          </div>
        </div>
      </div>

      {/* Vaccines History */}
      <div className="profile-card">
        <div className="section-title">
          <h3>Historique vaccinal</h3>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setShowAddVaccine(true)}
          >
            + Ajouter vaccination
          </Button>
        </div>

        <div className="vaccines-list">
          {patient.vaccines.map(vaccine => (
            <div key={vaccine.id} className="vaccine-item">
              <div className="vaccine-icon">💉</div>
              <div className="vaccine-details">
                <div className="vaccine-name">{vaccine.name}</div>
                <div className="vaccine-meta">
                  <span>{new Date(vaccine.date).toLocaleDateString("fr-FR")}</span>
                  <span>Lot: {vaccine.lot}</span>
                  <span>Agent: {vaccine.agent}</span>
                </div>
              </div>
              <div className="vaccine-badge">✓ Complété</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Vaccines */}
      <div className="profile-card">
        <h3 className="section-title">Vaccins à venir</h3>

        <div className="next-vaccines">
          {patient.nextVaccines.map((v, idx) => (
            <div key={idx} className="next-vaccine-item">
              <div className="next-vaccine-check">⏰</div>
              <div className="next-vaccine-info">
                <div className="next-vaccine-name">{v.name}</div>
                <div className="next-vaccine-date">Prévu: {new Date(v.date).toLocaleDateString("fr-FR")}</div>
              </div>
              <Button variant="secondary" size="sm">Programmer</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Vaccine */}
      <Modal
        isOpen={showAddVaccine}
        onClose={() => setShowAddVaccine(false)}
        title="Ajouter une vaccination"
        footer={
          <div style={{ display: "flex", gap: "1rem" }}>
            <Button variant="ghost" onClick={() => setShowAddVaccine(false)}>Annuler</Button>
            <Button onClick={handleAddVaccine}>Enregistrer</Button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-field">
            <label className="form-label">Vaccine</label>
            <input
              type="text"
              placeholder="Ex: Polio 1/3"
              value={formData.vaccine}
              onChange={(e) => setFormData({...formData, vaccine: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="form-input"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Numéro de lot</label>
            <input
              type="text"
              placeholder="Ex: LOT-001-POLIO"
              value={formData.lot}
              onChange={(e) => setFormData({...formData, lot: e.target.value})}
              className="form-input"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

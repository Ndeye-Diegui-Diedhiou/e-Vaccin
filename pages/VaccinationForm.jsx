import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { Button } from "../components/Button";
import { FormField } from "../components/FormField";
import { Modal } from "../components/Modal";
import "./VaccinationForm.css";

const VACCINES = [
  "BCG", "Polio 1/3", "Polio 2/3", "Polio 3/3",
  "DTC 1/3", "DTC 2/3", "DTC 3/3",
  "Rougeole", "Rubéole", "Fièvre jaune"
];

export function VaccinationForm({ patientName = "Patient", onSuccess }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm(
    {
      vaccine: "",
      date: new Date().toISOString().split("T")[0],
      lot: "",
      site: "bras-gauche",
      notes: "",
    },
    async (values) => {
      await new Promise(r => setTimeout(r, 800));
      
      if (values.vaccine && values.date && values.lot) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          form.reset();
          onSuccess?.(values);
        }, 2000);
      }
    }
  );

  return (
    <div className="vaccination-form-container">
      <div className="form-card">
        <div className="form-header">
          <h2>Enregistrer une vaccination</h2>
          <p className="form-subtitle">Patient: <strong>{patientName}</strong></p>
        </div>

        {showSuccess && (
          <div className="form-success-banner">
            ✓ Vaccination enregistrée avec succès !
          </div>
        )}

        <form onSubmit={form.handleSubmit}>
          <div className="form-grid">
            <FormField
              label="Type de vaccin"
              name="vaccine"
              as="select"
              value={form.values.vaccine}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.vaccine}
              touched={form.touched.vaccine}
              required
            >
              <option value="">Sélectionner un vaccin</option>
              {VACCINES.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </FormField>

            <FormField
              label="Date de vaccination"
              name="date"
              type="date"
              value={form.values.date}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.date}
              touched={form.touched.date}
              required
            />

            <FormField
              label="Numéro de lot"
              name="lot"
              placeholder="Ex: LOT-001-BCG"
              value={form.values.lot}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.errors.lot}
              touched={form.touched.lot}
              required
            />

            <FormField
              label="Site d'injection"
              name="site"
              as="select"
              value={form.values.site}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            >
              <option value="bras-gauche">Bras gauche</option>
              <option value="bras-droit">Bras droit</option>
              <option value="cuisse-gauche">Cuisse gauche</option>
              <option value="cuisse-droit">Cuisse droite</option>
            </FormField>
          </div>

          <FormField
            label="Notes additionnelles"
            name="notes"
            as="textarea"
            placeholder="Ex: Bon déroulement, aucune réaction..."
            value={form.values.notes}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />

          <div className="form-actions">
            <Button variant="ghost" type="button">Annuler</Button>
            <Button type="submit" loading={form.isSubmitting}>
              Enregistrer la vaccination
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import "./e-vaccin-login.css";
import { useForm } from "./hooks/useForm";

/* ── Icônes SVG inline ── */
const Icon = {
  logo: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L8 6H4l2 4-2 4h4l4 4 4-4h4l-2-4 2-4h-4L12 2z" fill="white" opacity="0.9"/>
      <circle cx="12" cy="12" r="2.5" fill="white"/>
    </svg>
  ),
  user: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
        stroke="#7A8FA6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#7A8FA6" strokeWidth="1.8"/>
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#7A8FA6" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  eyeOn: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  eyeOff: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  alert: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:1}}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  check: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{flexShrink:0,marginTop:1}}>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  shield: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#7A8FA6" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  card: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/>
    </svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

/* ── Données rôles ── */
const ROLES = [
  { id: "agent",  label: "Agent de santé", emoji: "🏥" },
  { id: "medecin", label: "Médecin",       emoji: "👨‍⚕️" },
  { id: "admin",  label: "Administrateur", emoji: "🔐" },
];

/* ── Validation ── */
function validateEmail(v) {
  if (!v) return "L'identifiant est requis.";
  return "";
}
function validatePassword(v) {
  if (!v) return "Le mot de passe est requis.";
  if (v.length < 6) return "Minimum 6 caractères.";
  return "";
}

/* ── Composant principal ── */
export default function EVaccinLogin() {
  const [role, setRole] = useState("agent");
  const [remember, setRemember] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showPw, setShowPw] = useState(false);

  const form = useForm(
    { email: "", password: "" },
    async (values) => {
      setApiError(null);
      try {
        await new Promise(r => setTimeout(r, 1200));
        
        if (values.email === "admin@evaccin.sn" && values.password === "demo123") {
          // Succès
          console.log("Login successful for:", values.email, "with role:", role);
          // Ici, redirection vers le dashboard
        } else {
          throw new Error("Identifiants invalides. Essayez admin@evaccin.sn / demo123");
        }
      } catch (err) {
        setApiError(err.message);
        throw err;
      }
    }
  );

  useEffect(() => {
    if (form.errors.email && form.touched.email) {
      form.setFieldError("email", form.errors.email);
    }
  }, [form.errors, form.touched]);

  return (
    <div className="ev-login-page">

      {/* ══ PANNEAU GAUCHE ══ */}
      <aside className="ev-login-left">
        <div className="ev-left-deco ev-left-deco-1" />
        <div className="ev-left-deco ev-left-deco-2" />
        <div className="ev-left-deco ev-left-deco-3" />

        {/* Logo */}
        <div className="ev-left-logo">
          <div className="ev-left-logo-icon">{Icon.logo}</div>
          <span className="ev-left-logo-name">e-Vaccin</span>
          <span className="ev-left-logo-badge">SÉNÉGAL</span>
        </div>

        {/* Corps */}
        <div className="ev-left-body">
          <h2 className="ev-left-title">
            Bienvenue sur<br />
            <span className="ev-accent">la plateforme nationale</span><br />
            de vaccination
          </h2>
          <p className="ev-left-sub">
            Connectez-vous pour accéder aux dossiers vaccinaux, enregistrer des vaccinations et générer des certificats numériques.
          </p>

          <div className="ev-left-stats">
            <div className="ev-left-stat-card">
              <div className="ev-left-stat-num">120K+</div>
              <div className="ev-left-stat-label">Vaccinations enregistrées</div>
            </div>
            <div className="ev-left-stat-card">
              <div className="ev-left-stat-num">47</div>
              <div className="ev-left-stat-label">Districts couverts</div>
            </div>
            <div className="ev-left-stat-card">
              <div className="ev-left-stat-num">14</div>
              <div className="ev-left-stat-label">Régions actives</div>
            </div>
            <div className="ev-left-stat-card">
              <div className="ev-left-stat-num">1 200+</div>
              <div className="ev-left-stat-label">Agents formés</div>
            </div>
          </div>
        </div>

        {/* Témoignage */}
        <div className="ev-left-quote">
          <p className="ev-left-quote-text">
            "e-Vaccin a transformé notre façon de travailler. Le suivi des enfants est devenu instantané, même dans les zones reculées."
          </p>
          <div className="ev-left-quote-author">
            <div className="ev-quote-avatar">FK</div>
            <div>
              <div className="ev-quote-name">Fatou Konaté</div>
              <div className="ev-quote-role">Infirmière — Centre de santé de Touba</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ══ PANNEAU DROIT ══ */}
      <main className="ev-login-right">
        <div className="ev-form-wrapper">

          {/* En-tête */}
          <div className="ev-form-header">
            <h1>Connexion</h1>
            <p>Sélectionnez votre profil et entrez vos identifiants</p>
          </div>

          {/* Sélecteur rôle */}
          <div className="ev-role-selector">
            {ROLES.map(r => (
              <button
                key={r.id}
                className={`ev-role-btn${role === r.id ? " active" : ""}`}
                onClick={() => setRole(r.id)}
                type="button"
              >
                <span className="ev-role-icon">{r.emoji}</span>
                {r.label}
              </button>
            ))}
          </div>

          {/* Erreur API */}
          {apiError && (
            <div className="ev-alert ev-alert-error">
              {Icon.alert}
              <div>
                <strong>Erreur de connexion</strong>
                <p style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>{apiError}</p>
              </div>
            </div>
          )}

          {form.values.email === "admin@evaccin.sn" && form.values.password === "demo123" && form.isSubmitting === false && apiError === null && (
            <div className="ev-alert ev-alert-success">
              {Icon.check}
              <div>
                <strong>Connexion réussie !</strong>
                <p style={{ marginTop: "0.25rem", fontSize: "0.85rem" }}>Redirection vers le tableau de bord…</p>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={form.handleSubmit} noValidate>

            {/* Email / ID */}
            <div className="ev-form-group">
              <label className="ev-form-label" htmlFor="ev-email">
                Adresse e-mail ou identifiant
              </label>
              <div className="ev-input-wrap">
                <span className="ev-input-icon">{Icon.user}</span>
                <input
                  id="ev-email"
                  name="email"
                  type="email"
                  className={`ev-input${form.errors.email && form.touched.email ? " error" : ""}`}
                  placeholder="agent@evaccin.sn"
                  value={form.values.email}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  autoComplete="username"
                  required
                />
              </div>
              {form.errors.email && form.touched.email && (
                <div className="ev-field-error">{Icon.alert} {form.errors.email}</div>
              )}
            </div>

            {/* Mot de passe */}
            <div className="ev-form-group">
              <label className="ev-form-label" htmlFor="ev-password">
                Mot de passe
              </label>
              <div className="ev-input-wrap">
                <span className="ev-input-icon">{Icon.lock}</span>
                <input
                  id="ev-password"
                  name="password"
                  type="password"
                  className={`ev-input${form.errors.password && form.touched.password ? " error" : ""}`}
                  placeholder="••••••••"
                  value={form.values.password}
                  onChange={form.handleChange}
                  onBlur={form.handleBlur}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="ev-toggle-pw"
                  onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? "Masquer" : "Afficher"}
                >
                  {showPw ? Icon.eyeOff : Icon.eyeOn}
                </button>
              </div>
              {form.errors.password && form.touched.password && (
                <div className="ev-field-error">{Icon.alert} {form.errors.password}</div>
              )}
            </div>

            {/* Options */}
            <div className="ev-form-options">
              <label className="ev-checkbox-label">
                <input
                  type="checkbox"
                  className="ev-checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                Se souvenir de moi
              </label>
              <a href="#" className="ev-forgot-link">Mot de passe oublié ?</a>
            </div>

            {/* Submit */}
            <button className="ev-btn-submit" type="submit" disabled={form.isSubmitting}>
              {form.isSubmitting
                ? <><span className="ev-spinner" /> Connexion en cours…</>
                : <>{Icon.arrowRight} Se connecter</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="ev-divider">
            <div className="ev-divider-line" />
            <span>ou connectez-vous avec</span>
            <div className="ev-divider-line" />
          </div>

          {/* Carte CPS */}
          <button className="ev-btn-alt" type="button">
            {Icon.card}
            Carte Professionnelle de Santé (CPS)
          </button>

          {/* Lien inscription */}
          <p className="ev-form-footer">
            Première connexion ?{" "}
            <a href="#">Demander un accès</a>
          </p>

          {/* Sécurité */}
          <div className="ev-security-row">
            {Icon.shield}
            Connexion sécurisée — chiffrement SSL/TLS 256 bits
          </div>

          {/* Compte démo */}
          <p style={{ textAlign:"center", marginTop:"1rem", fontSize:"0.75rem", color:"#C8D6E8" }}>
            Démo : <strong style={{color:"#7A8FA6"}}>admin@evaccin.sn</strong> / <strong style={{color:"#7A8FA6"}}>demo123</strong>
          </p>
        </div>
      </main>

    </div>
  );
}
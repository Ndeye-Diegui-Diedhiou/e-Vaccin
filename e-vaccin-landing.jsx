import { useState, useEffect, useRef } from "react";
import "./e-vaccin-landing.css";

/* ── Icônes SVG (trait bleu) ── */
const ICONS = {
  carnet:   <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  calendar: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#185FA5" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#185FA5" strokeWidth="2" strokeLinecap="round"/></svg>,
  stats:    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 20H7a2 2 0 01-2-2V8l4-4h8a2 2 0 012 2v12a2 2 0 01-2 2z" stroke="#185FA5" strokeWidth="2"/><path d="M9 4v4H5M9 13h6M9 17h4" stroke="#185FA5" strokeWidth="2" strokeLinecap="round"/></svg>,
  shield:   <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  globe:    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#185FA5" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="#185FA5" strokeWidth="2"/></svg>,
  offline:  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  logo:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L8 6H4l2 4-2 4h4l4 4 4-4h4l-2-4 2-4h-4L12 2z" fill="white" opacity="0.9"/><circle cx="12" cy="12" r="2.5" fill="white"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ── Data ── */
const NAV_LINKS = ["Accueil", "Fonctionnalités", "Comment ça marche", "À propos"];

const FEATURES = [
  { icon: ICONS.carnet,   title: "Carnet vaccinal numérique",   desc: "Accédez à l'historique complet des vaccinations de chaque patient, en temps réel, depuis n'importe quel centre de santé." },
  { icon: ICONS.calendar, title: "Rappels & calendrier vaccinal", desc: "Planification intelligente des doses de rappel selon le calendrier vaccinal national du Sénégal." },
  { icon: ICONS.stats,    title: "Rapports & statistiques",      desc: "Tableaux de bord analytiques pour les autorités sanitaires, avec données agrégées par région et par district." },
  { icon: ICONS.shield,   title: "Sécurité & confidentialité",   desc: "Données médicales chiffrées, accès basé sur les rôles, conforme aux normes de protection des données de santé." },
  { icon: ICONS.globe,    title: "Accès multi-centres",          desc: "Interopérabilité entre tous les postes de santé, centres de santé et hôpitaux du réseau national." },
  { icon: ICONS.offline,  title: "Mode hors ligne",              desc: "Fonctionnel même sans connexion internet, avec synchronisation automatique dès le retour du réseau." },
];

const STEPS = [
  { title: "Enregistrement patient",      desc: "L'agent de santé crée ou retrouve le dossier du patient via son numéro CNI ou identifiant unique." },
  { title: "Consultation du carnet",      desc: "Affichage instantané de l'historique vaccinal, des doses reçues et des rappels planifiés." },
  { title: "Enregistrement vaccination",  desc: "Saisie du vaccin administré, du lot, de la date et de la signature électronique du prestataire." },
  { title: "Génération du certificat",    desc: "Certificat vaccinal numérique généré et partageable, compatible aux standards internationaux." },
];

const STATS = [
  { value: 120000, suffix: "+", label: "Vaccinations enregistrées" },
  { value: 47,     suffix: "",  label: "Districts sanitaires couverts" },
  { value: 1200,   suffix: "+", label: "Agents de santé formés" },
  { value: 14,     suffix: "",  label: "Régions médicales actives" },
];

const FOOTER_COLS = [
  { title: "Plateforme", links: ["Fonctionnalités", "Comment ça marche", "Tarification", "Sécurité"] },
  { title: "Support",    links: ["Documentation", "Formation", "Contact", "FAQ"] },
  { title: "Légal",      links: ["Confidentialité", "Conditions d'utilisation", "Mentions légales"] },
];

/* ── Hook counter animé ── */
function useCountUp(target, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

/* ── Composants ── */
function StatCard({ value, suffix, label, active }) {
  const count = useCountUp(value, 1800, active);
  return (
    <div className="ev-stat-card">
      <div className="ev-stat-number">{count.toLocaleString()}{suffix}</div>
      <div className="ev-stat-label">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="ev-feat-card">
      <div className="ev-feat-icon">{icon}</div>
      <h3 className="ev-feat-title">{title}</h3>
      <p className="ev-feat-desc">{desc}</p>
    </div>
  );
}

/* ── Page principale ── */
export default function EVaccinLanding() {
  const [scrolled, setScrolled]       = useState(false);
  const [statsActive, setStatsActive] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsActive(true); },
      { threshold: 0.35 }
    );
    if (statsRef.current) obs.observe(statsRef.current);

    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  return (
    <div>
      {/* ── NAVBAR ── */}
      <header className={`ev-navbar${scrolled ? " scrolled" : ""}`}>
        <div className="ev-navbar-inner">
          <div className="ev-logo">
            <div className="ev-logo-icon">{ICONS.logo}</div>
            <span className="ev-logo-name">e-Vaccin</span>
            <span className="ev-logo-badge">SÉNÉGAL</span>
          </div>

          <nav className="ev-nav-links">
            {NAV_LINKS.map(l => (
              <a key={l} href="#" className="ev-nav-link">{l}</a>
            ))}
          </nav>

          <div className="ev-nav-actions">
            <button className="ev-btn-login">Connexion</button>
            <button className="ev-btn-start">Démarrer</button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="ev-hero">
        <div className="ev-hero-deco ev-hero-deco-1" />
        <div className="ev-hero-deco ev-hero-deco-2" />
        <div className="ev-hero-deco ev-hero-deco-3" />

        <div className="ev-hero-content">
          <div className="ev-hero-tag">
            <span className="ev-hero-tag-dot" />
            <span>Système National de Vaccination Digitale</span>
          </div>

          <h1 className="ev-hero-title">
            La santé publique sénégalaise,<br />
            <span className="ev-accent">numérisée &amp; sécurisée</span>
          </h1>

          <p className="ev-hero-sub">
            e-Vaccin centralise les carnets de vaccination, simplifie le suivi des patients et offre des données en temps réel aux autorités sanitaires à travers tout le Sénégal.
          </p>

          <div className="ev-hero-cta">
            <button className="ev-btn-hero-primary">Accéder à la plateforme</button>
            <button className="ev-btn-hero-ghost">Voir la démo</button>
          </div>

          <div className="ev-hero-trust">
            {["Ministère de la Santé", "MSAS Sénégal", "OMS conforme", "ISO 27001"].map(b => (
              <div key={b} className="ev-trust-item">
                {ICONS.check} {b}
              </div>
            ))}
          </div>
        </div>

        <div className="ev-scroll-indicator">
          <span className="ev-scroll-label">DÉFILER</span>
          <div className="ev-scroll-line" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="ev-stats-section" ref={statsRef}>
        <div className="ev-stats-inner">
          {STATS.map(s => (
            <StatCard key={s.label} {...s} active={statsActive} />
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="ev-features-section">
        <div className="ev-section-container">
          <div className="ev-section-header">
            <span className="ev-section-tag">Fonctionnalités clés</span>
            <h2 className="ev-section-title">Tout ce dont votre structure de santé a besoin</h2>
            <p className="ev-section-sub">
              Une solution complète pour la gestion des carnets vaccinaux, du patient individuel jusqu'au reporting national.
            </p>
          </div>
          <div className="ev-feat-grid">
            {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="ev-steps-section">
        <div className="ev-steps-inner">
          {/* Texte gauche */}
          <div>
            <span className="ev-section-tag">Comment ça marche</span>
            <h2 className="ev-section-title" style={{ maxWidth: 400 }}>
              Simple, rapide et efficace en 4 étapes
            </h2>
            <p className="ev-section-sub" style={{ margin: "1rem 0 0", textAlign: "left" }}>
              Conçu pour s'intégrer naturellement dans le workflow des agents de santé, même avec une connectivité limitée.
            </p>
            <div className="ev-steps-list">
              {STEPS.map((s, i) => (
                <div key={i} className="ev-step-item">
                  <div className="ev-step-badge">{i + 1}</div>
                  <div>
                    <h4 className="ev-step-title">{s.title}</h4>
                    <p className="ev-step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mockup droite */}
          <div className="ev-mockup-panel">
            <div className="ev-mockup-topbar">
              <div className="ev-mockup-dot" style={{ background: "#FF5F57" }} />
              <div className="ev-mockup-dot" style={{ background: "#FFBD2E" }} />
              <div className="ev-mockup-dot" style={{ background: "#28C840" }} />
              <span className="ev-mockup-url">e-vaccin.sn</span>
            </div>

            <div className="ev-mockup-patient-card">
              <p className="ev-mockup-patient-label">Dossier Patient</p>
              <p className="ev-mockup-patient-name">Amadou Diallo — #SN-2847391</p>
              <p className="ev-mockup-patient-meta">Né le 14 mars 2021 · Thiès</p>
            </div>

            {[
              { name: "BCG",         done: true },
              { name: "Polio VPO",   done: true },
              { name: "Pentavalent", done: false },
            ].map(v => (
              <div key={v.name} className="ev-mockup-vaccin-row">
                <span className="ev-mockup-vaccin-name">{v.name}</span>
                <span className={v.done ? "ev-mockup-badge-done" : "ev-mockup-badge-pending"}>
                  {v.done ? "Administré" : "À planifier"}
                </span>
              </div>
            ))}

            <button className="ev-mockup-cta-btn">
              Générer le certificat vaccinal
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ev-cta-section">
        <div className="ev-cta-deco" />
        <div className="ev-cta-content">
          <h2 className="ev-cta-title">Prêt à digitaliser votre chaîne vaccinale ?</h2>
          <p className="ev-cta-sub">
            Rejoignez les structures de santé qui font confiance à e-Vaccin pour sécuriser et optimiser le suivi vaccinal au Sénégal.
          </p>
          <div className="ev-cta-actions">
            <button className="ev-btn-cta-primary">Demander une démonstration</button>
            <button className="ev-btn-cta-ghost">Nous contacter</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ev-footer">
        <div className="ev-footer-inner">
          <div className="ev-footer-grid">
            <div>
              <div className="ev-footer-logo">
                <div className="ev-footer-logo-icon">{ICONS.logo}</div>
                <span className="ev-footer-logo-name">e-Vaccin</span>
              </div>
              <p className="ev-footer-desc">
                Plateforme nationale de gestion digitale des carnets vaccinaux, développée pour améliorer la santé publique au Sénégal.
              </p>
            </div>
            {FOOTER_COLS.map(col => (
              <div key={col.title}>
                <h5 className="ev-footer-col-title">{col.title}</h5>
                <ul>
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="ev-footer-link">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="ev-footer-bottom">
            <p className="ev-footer-copy">© 2024–2025 e-Vaccin — Groupe G9 · ESP/UCAD · Projet MSI</p>
            <p className="ev-footer-copy">Développé avec Prof. Samba Diaw · Dakar, Sénégal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

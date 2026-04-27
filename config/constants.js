/* Application Configuration & Constants */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "https://api.evaccin.sn",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: "evaccin_token",
  USER_KEY: "evaccin_user",
  REFRESH_TOKEN_KEY: "evaccin_refresh_token",
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};

// Roles
export const ROLES = {
  AGENT: "agent",
  MEDECIN: "medecin",
  ADMIN: "admin",
};

// Vaccine Types
export const VACCINES = {
  BCG: { name: "BCG", doses: 1, interval: 0 },
  POLIO: { name: "Polio", doses: 3, interval: 4 },
  DTC: { name: "DTC (Diphtérie, Tétanos, Coqueluche)", doses: 3, interval: 4 },
  ROUGEOLE: { name: "Rougeole", doses: 1, interval: 0 },
  FIEVRE_JAUNE: { name: "Fièvre jaune", doses: 1, interval: 0 },
  MENINGOCOQUE: { name: "Méningocoque", doses: 1, interval: 0 },
};

// Vaccination Status
export const VACCINATION_STATUS = {
  UP_TO_DATE: "up-to-date",
  PENDING: "pending",
  OVERDUE: "overdue",
  VACCINED: "vaccined",
};

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+221|00221|0)?[6789]\d{8}$/,
  CNI: /^\d{13}$/,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
};

// Feature Flags
export const FEATURES = {
  OFFLINE_MODE: true,
  TWO_FACTOR_AUTH: false,
  DATA_EXPORT: true,
  ANALYTICS: true,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Erreur réseau. Veuillez vérifier votre connexion.",
  SERVER_ERROR: "Erreur serveur. Veuillez réessayer plus tard.",
  UNAUTHORIZED: "Authentification échouée. Veuillez vous reconnecter.",
  FORBIDDEN: "Accès refusé. Vous n'avez pas les permissions nécessaires.",
  NOT_FOUND: "La ressource demandée n'existe pas.",
  VALIDATION_ERROR: "Veuillez vérifier les champs obligatoires.",
  UNKNOWN_ERROR: "Une erreur inattendue s'est produite.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Connexion réussie !",
  LOGOUT_SUCCESS: "Déconnexion réussie.",
  PATIENT_CREATED: "Patient enregistré avec succès.",
  VACCINATION_RECORDED: "Vaccination enregistrée avec succès.",
  DATA_SAVED: "Données sauvegardées.",
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: "dd/MM/yyyy",
  LONG: "EEEE dd MMMM yyyy",
  TIME: "HH:mm:ss",
  FULL: "dd/MM/yyyy HH:mm",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: "page_view",
  LOGIN: "login",
  LOGOUT: "logout",
  PATIENT_SEARCH: "patient_search",
  VACCINATION_RECORDED: "vaccination_recorded",
  REPORT_GENERATED: "report_generated",
};

export default {
  API_CONFIG,
  AUTH_CONFIG,
  ROLES,
  VACCINES,
  VACCINATION_STATUS,
  VALIDATION_RULES,
  FEATURES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  DATE_FORMATS,
  PAGINATION,
  ANALYTICS_EVENTS,
};

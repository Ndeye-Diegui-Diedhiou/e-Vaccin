/* Utility Functions */

/**
 * Format date to French locale
 */
export function formatDate(date, format = "short") {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  if (format === "short") return `${day}/${month}/${year}`;
  if (format === "long") {
    const months = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    return `${day} ${months[d.getMonth()]} ${year}`;
  }
  return `${day}/${month}/${year}`;
}

/**
 * Calculate age from birth date
 */
export function calculateAge(birthDate) {
  const today = new Date();
  let age = today.getFullYear() - new Date(birthDate).getFullYear();
  const monthDiff = today.getMonth() - new Date(birthDate).getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < new Date(birthDate).getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate email
 */
export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number (Senegal format)
 */
export function validatePhone(phone) {
  const re = /^(\+221|00221|0)?[6789]\d{8}$/;
  return re.test(phone);
}

/**
 * Format phone number
 */
export function formatPhone(phone) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 9) {
    return `+221 ${cleaned.substring(0, 2)} ${cleaned.substring(2, 5)} ${cleaned.substring(5)}`;
  }
  return phone;
}

/**
 * Validate CNI (Senegal ID)
 */
export function validateCNI(cni) {
  return /^\d{13}$/.test(cni);
}

/**
 * Format CNI
 */
export function formatCNI(cni) {
  const cleaned = cni.replace(/\D/g, "");
  if (cleaned.length === 13) {
    return `${cleaned.substring(0, 8)} ${cleaned.substring(8)}`;
  }
  return cni;
}

/**
 * Truncate text
 */
export function truncate(text, length = 50) {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Debounce function
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle(func, delay = 300) {
  let lastCall = 0;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      func(...args);
      lastCall = now;
    }
  };
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Get initials from name
 */
export function getInitials(name) {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Generate unique ID
 */
export function generateId(prefix = "") {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse error message
 */
export function parseErrorMessage(error) {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return "Une erreur inattendue s'est produite.";
}

/**
 * Retry async function
 */
export async function retryAsync(func, retries = 3, delay = 1000) {
  try {
    return await func();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise(r => setTimeout(r, delay));
    return retryAsync(func, retries - 1, delay);
  }
}

/**
 * Sleep function
 */
export function sleep(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sort array of objects
 */
export function sortBy(array, key, order = "asc") {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === "asc" ? -1 : 1;
    if (a[key] > b[key]) return order === "asc" ? 1 : -1;
    return 0;
  });
}

/**
 * Group array by key
 */
export function groupBy(array, key) {
  return array.reduce((acc, obj) => {
    const group = obj[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(obj);
    return acc;
  }, {});
}

/**
 * Filter by search term
 */
export function filterBySearch(array, searchTerm, keys = []) {
  const term = searchTerm.toLowerCase();
  return array.filter(item => 
    keys.some(key => 
      String(item[key]).toLowerCase().includes(term)
    )
  );
}

export default {
  formatDate,
  calculateAge,
  validateEmail,
  validatePhone,
  formatPhone,
  validateCNI,
  formatCNI,
  truncate,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  getInitials,
  generateId,
  parseErrorMessage,
  retryAsync,
  sleep,
  sortBy,
  groupBy,
  filterBySearch,
};

/* API Integration Examples - Replace Mock Data with Real API */

/**
 * EXEMPLE 1: Intégrer useAuth avec une vraie API
 */

// ❌ AVANT (Mock)
export function useAuth() {
  const login = useCallback(async (email, password, role) => {
    // Simulation
    await new Promise(r => setTimeout(r, 1200));
    // ...
  }, []);
}

// ✅ APRÈS (API Réelle)
export function useAuth() {
  const login = useCallback(async (email, password, role) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const { user, token, refreshToken } = await response.json();
    
    // Stockage sécurisé
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
    return user;
  }, []);
}

---

/**
 * EXEMPLE 2: API Service avec Interceptors
 */

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  // Get token from storage
  getToken() {
    return localStorage.getItem("token");
  }

  // Refresh token
  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: "POST",
      headers: this.defaultHeaders,
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Logout user
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      throw new Error("Token refresh failed");
    }

    const { token, refreshToken: newRefreshToken } = await response.json();
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", newRefreshToken);
    return token;
  }

  // Make request with auth
  async request(endpoint, options = {}) {
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    // Add auth token
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle token expiration
    if (response.status === 401) {
      try {
        const newToken = await this.refreshToken();
        headers["Authorization"] = `Bearer ${newToken}`;

        response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          headers,
        });
      } catch (error) {
        // Redirect to login
        window.location.href = "/login";
        throw error;
      }
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API Error");
    }

    return response.json();
  }

  // Convenient methods
  get(endpoint) {
    return this.request(endpoint, { method: "GET" });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// Usage
const api = new ApiClient(process.env.REACT_APP_API_URL);

---

/**
 * EXEMPLE 3: Dashboard avec données API
 */

// ❌ AVANT (Mock)
export function Dashboard({ user }) {
  useEffect(() => {
    setStats({ totalPatients: 1248, vaccined: 1089, ... });
    setPatients([{ id: 1, name: "Moussa", ... }, ...]);
  }, []);
}

// ✅ APRÈS (API Réelle)
export function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsData = await api.get("/dashboard/stats");
        setStats(statsData);

        // Fetch patients
        const patientsData = await api.get("/patients?limit=20");
        setPatients(patientsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="dashboard">
      {/* ... */}
    </div>
  );
}

---

/**
 * EXEMPLE 4: Ajouter un nouveau patient
 */

// Dans PatientProfile ou NewPatient page
export function AddPatientForm() {
  const form = useForm(
    {
      name: "",
      cni: "",
      birthDate: "",
      mother: "",
      phone: "",
    },
    async (values) => {
      try {
        const newPatient = await api.post("/patients", values);
        console.log("Patient created:", newPatient);
        // Redirect ou refresh list
      } catch (error) {
        form.setFieldError("name", error.message);
      }
    }
  );

  return (
    <form onSubmit={form.handleSubmit}>
      {/* Form fields... */}
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Creating..." : "Add Patient"}
      </button>
    </form>
  );
}

---

/**
 * EXEMPLE 5: Recherche de patients (avec debounce)
 */

import { debounce } from "./utils/helpers";

export function PatientSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = debounce(async (query) => {
    if (!query) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await api.get(`/patients/search?q=${query}`);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un patient..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {loading && <span>Recherche...</span>}
      {results.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
}

---

/**
 * EXEMPLE 6: Télécharger un certificat vaccinal
 */

export function VaccinationCertificate({ patientId }) {
  const handleDownload = async () => {
    try {
      const response = await api.get(`/patients/${patientId}/certificate/pdf`);
      // Create blob and download
      const blob = new Blob([response], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${patientId}.pdf`;
      a.click();
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <button onClick={handleDownload}>
      Télécharger le certificat
    </button>
  );
}

---

/**
 * EXEMPLE 7: Configuration .env
 */

// .env.development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_LOG_LEVEL=debug

// .env.production
REACT_APP_API_URL=https://api.evaccin.sn
REACT_APP_LOG_LEVEL=error

---

/**
 * EXEMPLE 8: Error Boundary pour gérer les erreurs
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
    // Send to error tracking service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Une erreur s'est produite</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>

---

/**
 * EXEMPLE 9: Pagination des résultats
 */

export function PatientList() {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPatients = async () => {
      const data = await api.get(`/patients?page=${page}&limit=20`);
      setPatients(data.patients);
      setTotalPages(data.totalPages);
    };
    fetchPatients();
  }, [page]);

  return (
    <div>
      {/* Patient list */}
      {patients.map(p => (...))}

      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(p => p - 1)}
        >
          Précédent
        </button>
        <span>{page} / {totalPages}</span>
        <button 
          disabled={page === totalPages} 
          onClick={() => setPage(p => p + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

---

/**
 * EXEMPLE 10: Sync données offline
 */

export function useOfflineSync() {
  const [isSyncing, setIsSyncing] = useState(false);

  const syncData = useCallback(async () => {
    const pendingActions = JSON.parse(
      localStorage.getItem("pendingActions") || "[]"
    );

    if (!navigator.onLine || pendingActions.length === 0) return;

    setIsSyncing(true);
    try {
      for (const action of pendingActions) {
        await api[action.method](action.endpoint, action.body);
      }
      localStorage.removeItem("pendingActions");
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Auto-sync when online
  useEffect(() => {
    window.addEventListener("online", syncData);
    return () => window.removeEventListener("online", syncData);
  }, [syncData]);

  return { isSyncing, syncData };
}

---

## 🔑 Points Importants

1. **Toujours gérer les erreurs** API
2. **Implémenter le token refresh** pour JWT
3. **Utiliser debounce** pour recherches
4. **Cacher les credentials** dans .env
5. **Implémenter offline sync** pour Mode hors-ligne
6. **Loguer les erreurs** pour debug
7. **Respecter CORS** et autres headers
8. **Valider côté client ET serveur**
9. **Implémenter retry logic** pour requêtes
10. **Documenter votre API** avec Swagger

---

**Bon courage avec l'intégration API!** 🚀

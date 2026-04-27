# Guide d'Utilisation - e-Vaccin

## 📚 Guides Compllets

### 1. Utiliser les Hooks

#### `useAuth` - Gestion de l'authentification

```jsx
import { useAuth } from "./hooks/useAuth";

export function MyComponent() {
  const { user, loading, error, login, logout, loadFromStorage } = useAuth();

  const handleLogin = async () => {
    try {
      const userData = await login("admin@evaccin.sn", "demo123", "agent");
      console.log("User logged in:", userData);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

#### `useForm` - Gestion des formulaires

```jsx
import { useForm } from "./hooks/useForm";

export function LoginForm() {
  const form = useForm(
    { email: "", password: "" },
    async (values) => {
      // Submit form
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      // Handle response...
    }
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        placeholder="Email"
      />
      {form.errors.email && form.touched.email && (
        <span>{form.errors.email}</span>
      )}

      <input
        name="password"
        type="password"
        value={form.values.password}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        placeholder="Password"
      />
      {form.errors.password && form.touched.password && (
        <span>{form.errors.password}</span>
      )}

      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
```

---

### 2. Utiliser les Composants

#### Button Component

```jsx
import { Button } from "./components/Button";

export function ButtonDemo() {
  return (
    <>
      {/* Variants */}
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Delete</Button>

      {/* Sizes */}
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>

      {/* States */}
      <Button disabled>Disabled</Button>
      <Button loading>Loading...</Button>

      {/* Other */}
      <Button fullWidth>Full Width</Button>
      <Button icon="🔍">Search</Button>
    </>
  );
}
```

#### FormField Component

```jsx
import { FormField } from "./components/FormField";

export function FormDemo() {
  const [value, setValue] = useState("");

  return (
    <FormField
      label="Your Name"
      name="name"
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      error="This field is required"
      touched={true}
      required
    />
  );
}
```

#### Modal Component

```jsx
import { Modal } from "./components/Modal";
import { useState } from "react";

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Confirmation"
        footer={
          <>
            <button onClick={() => setIsOpen(false)}>Cancel</button>
            <button onClick={() => setIsOpen(false)}>Confirm</button>
          </>
        }
      >
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </>
  );
}
```

---

### 3. Utiliser les Utilitaires

#### Date & Time Utils

```jsx
import { formatDate, calculateAge } from "./utils/helpers";

const birthDate = "2023-02-15";
console.log(formatDate(birthDate, "short")); // 15/02/2023
console.log(formatDate(birthDate, "long")); // 15 février 2023
console.log(calculateAge(birthDate)); // 2
```

#### Validation Utils

```jsx
import { 
  validateEmail, 
  validatePhone, 
  validateCNI,
  formatPhone,
  formatCNI 
} from "./utils/helpers";

console.log(validateEmail("test@example.com")); // true
console.log(validatePhone("+221771234567")); // true
console.log(validateCNI("1234567890123")); // true

console.log(formatPhone("+221771234567")); // +221 77 123 45 67
console.log(formatCNI("1234567890123")); // 12345678 90123
```

#### Array Utils

```jsx
import { sortBy, groupBy, filterBySearch } from "./utils/helpers";

const patients = [
  { id: 1, name: "Moussa", age: 5 },
  { id: 2, name: "Awa", age: 3 },
];

// Sort
const sorted = sortBy(patients, "name", "asc");

// Group
const grouped = groupBy(patients, "age"); // { 5: [...], 3: [...] }

// Search
const results = filterBySearch(patients, "Mou", ["name"]); // [{ id: 1, ... }]
```

#### Other Utils

```jsx
import { 
  getInitials, 
  generateId, 
  truncate, 
  debounce,
  deepClone 
} from "./utils/helpers";

console.log(getInitials("Moussa Konaté")); // MK
console.log(generateId("pat_")); // pat_1234567890_abc123def
console.log(truncate("Long text...", 10)); // Long tex...

const debouncedSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 300);

const clone = deepClone({ nested: { object: true } });
```

---

### 4. Pages & Workflows

#### Landing Page Navigation

```jsx
// In App.jsx
import EVaccinLanding from "./e-vaccin-landing";

<EVaccinLanding onLoginClick={() => setCurrentPage("login")} />
```

#### Authentication Flow

```jsx
// 1. User visits landing
// 2. Clicks "Connexion"
// 3. Fills login form
// 4. useAuth hook handles login
// 5. Redirects to Dashboard
// 6. Dashboard loads with user data
```

#### Patient Management

```jsx
// Dashboard → View Patient
// PatientProfile → Shows history
// PatientProfile → Add Vaccination
// VaccinationForm → Records data
// Success message → Back to Dashboard
```

---

### 5. Configuration

#### Environment Variables

Create `.env` file:

```
REACT_APP_API_URL=https://api.evaccin.sn
REACT_APP_ENV=development
REACT_APP_LOG_LEVEL=debug
```

#### Using Constants

```jsx
import { ROLES, VACCINATION_STATUS, ERROR_MESSAGES } from "./config/constants";

const userRole = ROLES.AGENT; // "agent"
const status = VACCINATION_STATUS.UP_TO_DATE; // "up-to-date"
const errorMsg = ERROR_MESSAGES.NETWORK_ERROR; // "Erreur réseau..."
```

---

### 6. Styling Best Practices

#### Using CSS Variables

```css
/* Use variables */
.component {
  background: var(--blue-700);
  color: var(--white);
  padding: var(--r-md);
  border-radius: var(--r-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .component {
    padding: var(--r-sm);
  }
}
```

#### Component Styling Pattern

```css
/* BEM Naming */
.component { }
.component__header { }
.component__body { }
.component__footer { }

.component--active { }
.component--disabled { }

.component-title { }
.component-subtitle { }
```

---

### 7. Common Patterns

#### Protected Routes

```jsx
function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

// Usage
<ProtectedRoute user={user}>
  <Dashboard />
</ProtectedRoute>
```

#### Form Submission

```jsx
async function handleSubmit(values) {
  try {
    const response = await fetch("/api/endpoint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    // Handle success
  } catch (error) {
    form.setFieldError("email", error.message);
  }
}
```

#### Data Fetching

```jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("/api/data");
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error.message);
    }
  };

  fetchData();
}, []);
```

---

## 📝 Checklist d'Intégration API

- [ ] Configure `.env` avec URL API
- [ ] Remplace `setTimeout` par `fetch` réel
- [ ] Ajoute intercepteurs pour tokens
- [ ] Implémente JWT refresh logic
- [ ] Ajoute gestion des erreurs API
- [ ] Teste avec backend réel
- [ ] Configure CORS si nécessaire
- [ ] Ajoute logging & monitoring
- [ ] Tests d'authentification
- [ ] Tests de production

---

## 🐛 Troubleshooting

### Formulaire ne se valide pas

**Solution**: Vérifiez que le `name` de l'input correspond au clé dans `initialValues` du hook `useForm`.

### Componants n'affichent pas les styles

**Solution**: Vérifiez que le fichier CSS est importé dans le composant avec `import "./Component.css"`.

### useAuth ne persiste pas

**Solution**: Appelez `loadFromStorage()` dans un `useEffect` au démarrage de l'app.

### Modal ne se ferme pas

**Solution**: Assurez-vous que `onClose` callback est passé et appelé.

---

## 📞 Support

Pour plus d'assistance, consultez:
- [Documentation React](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- Fichier README.md du projet

---

**Version**: 2.0  
**Dernière mise à jour**: Avril 2026

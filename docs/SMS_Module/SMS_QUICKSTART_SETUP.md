# SMS Integration Quick Start - e-Vaccin

## 🚀 Démarrage Rapide (5 minutes)

### 1. Configuration Initiale

#### Option A: Mock Provider (Développement)
```properties
# src/main/resources/application.properties
app.sms.provider=mock
# Aucune autre configuration nécessaire
```

#### Option B: Twilio (Production)
```bash
# 1. Créer un compte sur https://www.twilio.com/
# 2. Obtenir Account SID et Auth Token

# 3. Définir les variables d'environnement
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_auth_token_here"

# 4. Modifier application.properties
app.sms.provider=twilio
app.sms.twilio.from-number=+221761234567
```

### 2. Démarrer le Backend
```bash
cd backend
mvn clean spring-boot:run

# Vérifier dans les logs:
# "SMS provider initialized"
# "Mock SMS provider ready" ou "Twilio provider ready"
```

### 3. Tester Rapidement

#### PowerShell (Windows)
```powershell
cd e-vaccin
.\sms-test.ps1 -Provider "mock" -Verbose
```

#### Bash (Linux/Mac)
```bash
cd e-vaccin
chmod +x sms-test.sh
./sms-test.sh --provider=mock
```

#### Manual CURL Test
```bash
# Test basique - Envoyer SMS
curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 1,
    "phoneNumber": "+221761234567",
    "recipientName": "Test User",
    "message": "Bienvenue sur e-Vaccin",
    "templateType": "CUSTOM"
  }'

# Vérifier les stats
curl http://localhost:8080/api/notifications/stats
```

---

## 📋 Checklist - Intégration Complète

Avant de passer en production:

### Configuration SMS
- [ ] `app.sms.provider` configuré (mock ou twilio)
- [ ] Si Twilio: `TWILIO_ACCOUNT_SID` défini
- [ ] Si Twilio: `TWILIO_AUTH_TOKEN` défini
- [ ] Base de données MySQL accessible
- [ ] Table `notifications` créée

### Async & Scheduling
- [ ] `@EnableAsync` activé dans Spring Config
- [ ] `@EnableScheduling` activé
- [ ] `spring.task.execution.pool.core-size > 0`
- [ ] `spring.task.scheduling.pool.size > 0`

### Database
- [ ] Connection pool configurée (HikariCP)
- [ ] Indexes créés sur `patient_id`, `status`, `created_at`
- [ ] Migrations exécutées

### Security
- [ ] Variables d'environnement protégées
- [ ] Pas de credentials en dur dans le code
- [ ] HTTPS en production
- [ ] CORS correctement configuré

### Monitoring
- [ ] Logs configurés pour SMS module
- [ ] Alertes pour SMS échoués
- [ ] Dashboard de statistiques SMS

### Testing
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Tested avec vrais numéros (Twilio)
- [ ] Performance acceptable (< 100ms)

---

## 🔧 Configuration Détaillée

### application.properties Complet

```properties
# ============================================
# SMS Configuration
# ============================================
app.sms.provider=mock                          # mock | twilio
app.sms.max-retries=3                          # Nombre de retries
app.sms.retry-interval=300000                  # 5 minutes en ms

# Twilio Configuration (optionnel)
app.sms.twilio.account-sid=${TWILIO_ACCOUNT_SID}
app.sms.twilio.auth-token=${TWILIO_AUTH_TOKEN}
app.sms.twilio.from-number=+221761234567

# ============================================
# Async Processing
# ============================================
spring.task.execution.pool.core-size=2         # Min threads
spring.task.execution.pool.max-size=5          # Max threads
spring.task.execution.pool.queue-capacity=100  # Queue size
spring.task.execution.thread-name-prefix=sms-async-

# ============================================
# Scheduled Tasks
# ============================================
spring.task.scheduling.pool.size=2             # Scheduler threads
spring.task.scheduling.thread-name-prefix=sms-scheduler-

# ============================================
# Logging
# ============================================
logging.level.com.evaccin.service.SmsNotificationService=INFO
logging.level.com.evaccin.service.sms.provider=INFO
logging.level.com.evaccin.repository.NotificationRepository=DEBUG

# ============================================
# Database Connection Pool
# ============================================
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

### Environment Variables Setup

```bash
# Linux/Mac
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_auth_token_here"
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/evaccin_db"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="password"

# Windows (PowerShell)
$env:TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxx"
$env:TWILIO_AUTH_TOKEN="your_auth_token_here"
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/evaccin_db"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="password"

# Windows (CMD)
set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
set TWILIO_AUTH_TOKEN=your_auth_token_here
```

### Database Migration

```sql
-- Run in MySQL
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    user_id BIGINT,
    phone_number VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    message LONGTEXT NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    provider_reference VARCHAR(255),
    failure_reason TEXT,
    scheduled_time DATETIME,
    sent_time DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_scheduled_time (scheduled_time),
    INDEX idx_template_type (template_type)
);
```

---

## 📊 Vérification avec SQL

### Vérifier que tout fonctionne

```sql
-- Statistiques générales
SELECT 
    COUNT(*) as total,
    SUM(IF(status='SENT', 1, 0)) as sent,
    SUM(IF(status='FAILED', 1, 0)) as failed,
    SUM(IF(status='PENDING', 1, 0)) as pending
FROM notifications;

-- Erreurs récentes
SELECT id, phone_number, failure_reason, created_at
FROM notifications
WHERE status = 'FAILED'
ORDER BY created_at DESC
LIMIT 10;

-- SMS planifiés à venir
SELECT id, recipient_name, scheduled_time
FROM notifications
WHERE scheduled_time > NOW() AND status = 'PENDING'
ORDER BY scheduled_time ASC;
```

---

## 🐛 Troubleshooting Courant

### Problème: "SMS provider not configured"

**Cause:** Le provider SMS n'est pas activé ou mal configuré.

**Solution:**
```bash
# Vérifier que app.sms.provider est défini
grep "app.sms.provider" src/main/resources/application.properties

# Vérifier les logs
tail -f logs/spring.log | grep -i "provider\|sms"
```

### Problème: Twilio retourne 401 (Unauthorized)

**Cause:** Credentials invalides ou incorrects.

**Solution:**
```bash
# Vérifier credentials
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN

# Vérifier que le format du numéro de téléphone est correct
# Doit commencer par +
# Exemple: +221761234567 (valide), 221761234567 (invalide)
```

### Problème: SMS bloquent les requêtes

**Cause:** Async processing non activé.

**Solution:**
1. Vérifier que `@EnableAsync` est présent dans la config Spring
2. Vérifier `spring.task.execution.pool.core-size > 0`
3. Redémarrer le backend

### Problème: Scheduled tasks ne s'exécutent pas

**Cause:** Scheduling non activé.

**Solution:**
```properties
# Ajouter à application.properties
spring.task.scheduling.pool.size=2

# Vérifier logs pour "scheduled"
tail -f logs/spring.log | grep -i "scheduled"
```

---

## 📞 Endpoints Disponibles

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications/stats` | GET | Stats globales |
| `/api/notifications/send-sms` | POST | Envoi SMS personnalisé |
| `/api/notifications/vaccination-confirmation` | POST | Confirmation vaccination |
| `/api/notifications/vaccination-reminder` | POST | Reminder planifié |
| `/api/notifications/alert` | POST | Alerte urgente |
| `/api/notifications/{id}` | GET | Détail notification |
| `/api/notifications/patient/{patientId}` | GET | SMS d'un patient |

---

## 📚 Documentation Complète

- `SMS_INTEGRATION.md` - Documentation complète
- `SMS_TESTING_COMPLETE_GUIDE.md` - Guide de test détaillé
- `SMS_MAVEN_DEPENDENCIES.md` - Dépendances Maven
- `SMS_QUICKSTART.md` - Quick start guide

---

## ✅ Next Steps

1. **Démarrer le backend** avec mock provider
2. **Tester localement** avec les scripts fournis
3. **Configurer Twilio** (optionnel)
4. **Déployer** en production
5. **Monitorer** les SMS en temps réel

---

## 💡 Tips & Tricks

### Pour développement local:
- Utilisez le mock provider pour éviter les coûts
- Consultez les logs: `tail -f logs/spring.log | grep SMS`
- Testez avec la base H2 embeddée en dev

### Pour production:
- Utilisez Twilio avec vrai compte
- Configurez les variables d'environnement
- Activez le monitoring/alertes
- Testez avec vrais numéros d'abord

### Performance:
- Async garantit que SMS n'bloque pas les requêtes
- Batch SMS rapides (> 1000/min possible)
- Scheduled tasks retryent tous les 5 minutes


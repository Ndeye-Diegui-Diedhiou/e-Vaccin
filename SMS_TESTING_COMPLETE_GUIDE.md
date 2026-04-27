# SMS Integration Testing Guide - e-Vaccin

## Quick Start - Test Complet en 5 Étapes

### Prérequis
- Backend e-vaccin en cours d'exécution (port 8080)
- Configuration SMS dans `application.properties` (mock ou twilio)
- MySQL database (evaccin_db)

---

## Étape 1: Vérifier la Configuration SMS

### Test 1.1 - Vérifier le provider SMS
```bash
# Vérifie que le service répond et les stats sont disponibles
curl -X GET http://localhost:8080/api/notifications/stats \
  -H "Content-Type: application/json"
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "total": 0,
    "sent": 0,
    "failed": 0
  }
}
```

### Test 1.2 - Vérifier les logs SMS
```bash
# Monitorer les logs en temps réel
tail -f logs/spring.log | grep -i "SMS\|sms\|notification"
```

**À rechercher dans les logs:**
- `SMS provider initialized`
- `Provider: Mock SMS` ou `Provider: Twilio`
- `Async executor initialized`

---

## Étape 2: Tester Envoi SMS Simple

### Test 2.1 - Envoyer un SMS personnalisé
```bash
curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 1,
    "phoneNumber": "+221761234567",
    "recipientName": "Fatou Diallo",
    "message": "TEST SMS - Bienvenue sur e-Vaccin",
    "templateType": "CUSTOM"
  }'
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "SMS sent",
  "data": null
}
```

### Test 2.2 - Vérifier le statut du SMS

Attendez 1-2 secondes, puis récupérez le notification ID depuis les logs.

```bash
# Le notification_id devrait être dans les logs
# Exemple: Notification saved with ID: 1
curl -X GET http://localhost:8080/api/notifications/1
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Notification found",
  "data": {
    "id": 1,
    "patientId": 1,
    "phoneNumber": "+221761234567",
    "recipientName": "Fatou Diallo",
    "message": "TEST SMS - Bienvenue sur e-Vaccin",
    "templateType": "CUSTOM",
    "status": "SENT",
    "retryCount": 0,
    "providerReference": "MOCK_abc123def456",
    "createdAt": "2026-04-27T11:30:00"
  }
}
```

---

## Étape 3: Tester Templates de Vaccination

### Test 3.1 - Envoi Confirmation Vaccination

```bash
curl -X POST http://localhost:8080/api/notifications/vaccination-confirmation \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 123,
    "patientName": "Moussa Konaté",
    "guardianPhone": "+221761234567",
    "guardianName": "Fatou Diallo",
    "vaccineName": "BCG"
  }'
```

**Réponse attendue:** ✅ `"success": true`

### Test 3.2 - Envoi Alerte Vaccination Urgente

```bash
curl -X POST http://localhost:8080/api/notifications/alert \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 456,
    "patientName": "Awa Seck",
    "guardianPhone": "+221765432109",
    "guardianName": "Aminata Ndiaye",
    "reason": "Outbreak detected - polio vaccination urgently needed"
  }'
```

**Réponse attendue:** ✅ `"success": true` avec emoji ⚠️ dans le message

### Test 3.3 - Planifier Reminder (24h avant)

```bash
# ISO 8601 format pour la date/heure (24h dans le futur)
APPOINTMENT_TIME="2026-04-28T14:30:00"

curl -X POST http://localhost:8080/api/notifications/vaccination-reminder \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 789,
    "patientName": "Demba Ba",
    "guardianPhone": "+221769876543",
    "guardianName": "Khadija Ba",
    "vaccineName": "Polio 1",
    "appointmentTime": "'$APPOINTMENT_TIME'",
    "appointmentLocation": "Clinique Dia Dakar"
  }'
```

**Réponse attendue:** ✅ `"Vaccination reminder scheduled"`

---

## Étape 4: Tester Récupération des Données

### Test 4.1 - Récupérer toutes les notifications d'un patient

```bash
curl -X GET http://localhost:8080/api/notifications/patient/123
```

**Réponse attendue:** Liste de tous les SMS envoyés au patient 123

### Test 4.2 - Récupérer une notification spécifique

```bash
curl -X GET http://localhost:8080/api/notifications/1
```

### Test 4.3 - Récupérer statistiques globales

```bash
curl -X GET http://localhost:8080/api/notifications/stats
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "total": 5,        # Nombre total de SMS
    "sent": 4,         # Réussis
    "failed": 1        # Échoués
  }
}
```

---

## Étape 5: Tester Scénarios d'Erreur

### Test 5.1 - Téléphone invalide

```bash
curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 1,
    "phoneNumber": "invalid",
    "recipientName": "Test",
    "message": "Test",
    "templateType": "CUSTOM"
  }'
```

**Résultat:** SMS créé avec statut PENDING, puis marqué FAILED après validation

### Test 5.2 - Données manquantes

```bash
curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 1
  }'
```

**Résultat attendu:** ❌ Erreur 400 Bad Request

---

## Étape 6: Vérifier Async & Scheduling

### Test 6.1 - Performance (Non-bloquant)

Envoyez 10 SMS simultanément et vérifiez que le serveur répond rapidement:

```bash
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/notifications/send-sms \
    -H "Content-Type: application/json" \
    -H "X-User-Id: 1" \
    -d '{
      "patientId": '$i',
      "phoneNumber": "+221761234567",
      "recipientName": "Guardian '$i'",
      "message": "Batch test SMS #'$i'",
      "templateType": "CUSTOM"
    }' &
done
wait
```

**Vérification:**
- Tous les requests retournent immédiatement (< 100ms)
- Les SMS sont traités de façon asynchrone
- Vérifiez les logs pour voir les traitements en arrière-plan

### Test 6.2 - Scheduled Task (Retry automatique)

1. Créez un SMS
2. Attendez 5-6 minutes
3. Vérifiez que les retries sont traités

```bash
# Monitorer les retries
tail -f logs/spring.log | grep -i "retry\|pending"
```

---

## Étape 7: Tests Spécifiques Twilio (si en production)

### Test 7.1 - Vérifier Configuration Twilio

```bash
# Vérifier que les variables d'environnement sont définies
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN
```

### Test 7.2 - Envoyer SMS via Twilio

```bash
# Changez app.sms.provider à "twilio" dans application.properties

curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 1,
    "phoneNumber": "+221761234567",
    "recipientName": "Real Test",
    "message": "SMS réel via Twilio",
    "templateType": "CUSTOM"
  }'
```

**Réponse:** Status SENT avec providerReference de Twilio

---

## SQL Queries pour Debugging

### Vérifier tous les SMS
```sql
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
```

### Vérifier les SMS échoués
```sql
SELECT * FROM notifications WHERE status = 'FAILED' ORDER BY created_at DESC;
```

### Statistiques par template
```sql
SELECT template_type, status, COUNT(*) as count 
FROM notifications 
GROUP BY template_type, status;
```

### SMS en attente de retry
```sql
SELECT * FROM notifications 
WHERE status = 'PENDING' AND retry_count < max_retries
ORDER BY created_at DESC;
```

### SMS planifiés à venir
```sql
SELECT * FROM notifications 
WHERE scheduled_time IS NOT NULL 
AND scheduled_time > NOW()
ORDER BY scheduled_time ASC;
```

---

## Checklist - Intégration Complète

- [ ] Configuration SMS chargée correctement
- [ ] Stats API répond avec 0 notifications initialement
- [ ] SMS personnalisé envoyé et reçu
- [ ] Templates (confirmation, reminder, alert) fonctionnent
- [ ] Statut de notification accessible
- [ ] Données de patient récupérées
- [ ] Erreurs gérées proprement
- [ ] Async processing non-bloquant confirmé
- [ ] Base de données mise à jour correctement
- [ ] Logs contiennent les bonnes informations

---

## Troubleshooting

### Symptôme: "SMS provider not configured"
**Solution:**
1. Vérifier `application.properties` contient `app.sms.provider=mock` ou `twilio`
2. Si Twilio: vérifier `TWILIO_ACCOUNT_SID` et `TWILIO_AUTH_TOKEN`

### Symptôme: SMS bloquent les requêtes
**Solution:**
1. Vérifier que `@Async` est activé: `@EnableAsync` dans config Spring
2. Vérifier logs pour voir si threads async tournent

### Symptôme: Scheduled tasks ne s'exécutent pas
**Solution:**
1. Vérifier `@EnableScheduling` est activé
2. Vérifier `spring.task.scheduling.pool.size > 0`

### Symptôme: Twilio retourne erreur 401
**Solution:**
1. Vérifier credentials sont corrects
2. Vérifier format numéro Twilio: doit commencer par `+`
3. Vérifier numéro téléphone cible est valide

---

## Support Contacts

Pour des questions SMS:
1. Vérifier les logs: `logs/spring.log`
2. Consulter `SMS_INTEGRATION.md` pour documentation complète
3. Vérifier `backend/SMS_CONFIG.properties` pour exemples


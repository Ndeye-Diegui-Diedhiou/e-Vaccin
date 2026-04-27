# SMS API - Examples cURL pour tester manuellement

## Configuration préalable

Le backend doit être en cours d'exécution sur `http://localhost:8080`

```bash
# Vérifier que le backend est prêt
curl http://localhost:8080/api/notifications/stats
```

---

## 1. STATS - Monitorer les SMS

### Récupérer statistiques globales
```bash
curl -X GET http://localhost:8080/api/notifications/stats \
  -H "Content-Type: application/json"
```

**Réponse attendue:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "total": 10,
    "sent": 8,
    "failed": 2
  }
}
```

---

## 2. SMS PERSONNALISÉ - Envoi libre

### Envoyer un SMS simple
```bash
curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 1,
    "phoneNumber": "+221761234567",
    "recipientName": "Fatou Diallo",
    "message": "Bienvenue sur e-Vaccin. Votre profil enfant a été créé.",
    "templateType": "CUSTOM"
  }'
```

### Envoyer SMS à plusieurs patients
```bash
# Boucle bash pour tester multiple SMS
for i in {1..3}; do
  curl -s -X POST http://localhost:8080/api/notifications/send-sms \
    -H "Content-Type: application/json" \
    -H "X-User-Id: 1" \
    -d '{
      "patientId": '$i',
      "phoneNumber": "+221761234567",
      "recipientName": "Guardian '$i'",
      "message": "SMS test #'$i' - Bienvenue",
      "templateType": "CUSTOM"
    }'
  echo "SMS $i envoyé"
done
```

---

## 3. VACCINATION - Confirmation Immédiate

### Envoyer confirmation vaccination BCG
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

### Envoyer confirmation Polio
```bash
curl -X POST http://localhost:8080/api/notifications/vaccination-confirmation \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 456,
    "patientName": "Awa Seck",
    "guardianPhone": "+221765432109",
    "guardianName": "Aminata Ndiaye",
    "vaccineName": "Polio 1"
  }'
```

### Envoyer confirmation DPT
```bash
curl -X POST http://localhost:8080/api/notifications/vaccination-confirmation \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 789,
    "patientName": "Demba Ba",
    "guardianPhone": "+221769876543",
    "guardianName": "Khadija Ba",
    "vaccineName": "DPT 1 (Diphtérie, Tétanos, Coqueluche)"
  }'
```

---

## 4. REMINDER - Rappel Vaccination Planifié

### Plannifier rappel pour demain 14h30

```bash
# Calculer la date/heure (demain à 14h30)
# Format ISO 8601: YYYY-MM-DDTHH:MM:SS

# Exemple pour demain:
TOMORROW_DATE=$(date -d "tomorrow" +%Y-%m-%d)
APPOINTMENT_TIME="${TOMORROW_DATE}T14:30:00"

curl -X POST http://localhost:8080/api/notifications/vaccination-reminder \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 111,
    "patientName": "Samba Diop",
    "guardianPhone": "+221762222222",
    "guardianName": "Aïssatou Sow",
    "vaccineName": "Polio 2",
    "appointmentTime": "'$APPOINTMENT_TIME'",
    "appointmentLocation": "Clinique Dia Dakar"
  }'
```

### Plannifier rappel pour 3 jours dans le futur

```bash
APPOINTMENT_DATE=$(date -d "+3 days" +%Y-%m-%d)
APPOINTMENT_TIME="${APPOINTMENT_DATE}T10:00:00"

curl -X POST http://localhost:8080/api/notifications/vaccination-reminder \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 222,
    "patientName": "Yacine Kane",
    "guardianPhone": "+221763333333",
    "guardianName": "Marie Diouf",
    "vaccineName": "ROR (Rougeole, Oreillons, Rubéole)",
    "appointmentTime": "'$APPOINTMENT_TIME'",
    "appointmentLocation": "Centre de Santé Yeumbeul"
  }'
```

### Plannifier rappel pour la semaine prochaine (avec heure personnalisée)

```bash
# Lundi 9h00
APPOINTMENT_TIME="2026-05-04T09:00:00"

curl -X POST http://localhost:8080/api/notifications/vaccination-reminder \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 333,
    "patientName": "Ousseyni Sy",
    "guardianPhone": "+221764444444",
    "guardianName": "Ndeye Ndiaye",
    "vaccineName": "Hepatitis B",
    "appointmentTime": "2026-05-04T09:00:00",
    "appointmentLocation": "Hôpital Aristide Le Dantec"
  }'
```

---

## 5. ALERTE - Urgence Vaccination

### Alerte: Outbreak détecté - Polio

```bash
curl -X POST http://localhost:8080/api/notifications/alert \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 444,
    "patientName": "Issa Niang",
    "guardianPhone": "+221765555555",
    "guardianName": "Khady Sy",
    "reason": "Outbreak polio détecté dans la région - Vaccination urgente recommandée"
  }'
```

### Alerte: Rattrapage vaccination urgente

```bash
curl -X POST http://localhost:8080/api/notifications/alert \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 555,
    "patientName": "Hady Sock",
    "guardianPhone": "+221766666666",
    "guardianName": "Pape Diouf",
    "reason": "Rattrapage vaccinal urgent - Enfant en retard pour plusieurs vaccins"
  }'
```

### Alerte: Ré-vaccin obligatoire

```bash
curl -X POST http://localhost:8080/api/notifications/alert \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 666,
    "patientName": "Babacar Fall",
    "guardianPhone": "+221767777777",
    "guardianName": "Fatoumata Bah",
    "reason": "Ré-vaccination BCG obligatoire suite à test tuberculinique négatif"
  }'
```

---

## 6. CONSULTER - Récupérer les données

### Récupérer une notification spécifique
```bash
# Remplacer {id} par le vrai ID (ex: 1, 2, 3...)
curl -X GET http://localhost:8080/api/notifications/1
```

### Récupérer toutes les notifications d'un patient
```bash
# Remplacer {patientId} par l'ID du patient
curl -X GET http://localhost:8080/api/notifications/patient/123
```

### Récupérer 5 derniers SMS d'un patient
```bash
curl -X GET http://localhost:8080/api/notifications/patient/123 | \
  python -m json.tool | head -50
```

---

## 7. BATCH TEST - Tester performance

### Envoyer 10 SMS rapidement (test async)

```bash
#!/bin/bash
echo "Envoi de 10 SMS en parallèle..."
START=$(date +%s%N)

for i in {1..10}; do
  curl -s -X POST http://localhost:8080/api/notifications/send-sms \
    -H "Content-Type: application/json" \
    -H "X-User-Id: 1" \
    -d '{
      "patientId": '$(($i + 1000))',
      "phoneNumber": "+221761234567",
      "recipientName": "Guardian '$i'",
      "message": "Batch SMS #'$i' - Test performance",
      "templateType": "CUSTOM"
    }' > /dev/null &
done

wait

END=$(date +%s%N)
ELAPSED=$(( ($END - $START) / 1000000 ))
echo "10 SMS envoyés en ${ELAPSED}ms"
echo "Si < 2000ms: Processing async confirmé ✓"
```

### PowerShell: Envoi 10 SMS en parallèle

```powershell
$start = Get-Date
$tasks = @()

for ($i = 1; $i -le 10; $i++) {
    $data = @{
        patientId = $i + 1000
        phoneNumber = "+221761234567"
        recipientName = "Guardian $i"
        message = "Batch SMS #$i - Test"
        templateType = "CUSTOM"
    } | ConvertTo-Json
    
    $task = Start-Job -ScriptBlock {
        param($data)
        Invoke-WebRequest -Uri "http://localhost:8080/api/notifications/send-sms" `
            -Method POST `
            -Headers @{"Content-Type" = "application/json"; "X-User-Id" = "1"} `
            -Body $data `
            -UseBasicParsing
    } -ArgumentList $data
    
    $tasks += $task
}

$tasks | Wait-Job | Out-Null
$end = Get-Date
$elapsed = ($end - $start).TotalMilliseconds

Write-Host "10 SMS envoyés en $([math]::Round($elapsed))ms"
Write-Host "Si < 2000ms: Processing async confirmé ✓"
```

---

## 8. MONITORING - Vérifier l'état

### Vérifier les logs en temps réel (Linux/Mac)
```bash
tail -f logs/spring.log | grep -i "sms\|notification"
```

### Vérifier les logs en temps réel (Windows PowerShell)
```powershell
Get-Content logs/spring.log -Wait | Select-String -Pattern "SMS|notification" -CaseSensitive:$false
```

### Compter les SMS envoyés par type
```bash
curl -s http://localhost:8080/api/notifications/stats | python -m json.tool
```

---

## 9. DATABASE - Vérifier directement

### Compter les SMS par statut
```bash
mysql -u root -p evaccin_db -e "
  SELECT status, COUNT(*) as count 
  FROM notifications 
  GROUP BY status;
"
```

### Voir les 10 derniers SMS
```bash
mysql -u root -p evaccin_db -e "
  SELECT id, recipient_name, message, status, created_at 
  FROM notifications 
  ORDER BY created_at DESC 
  LIMIT 10;
"
```

### Voir les SMS échoués
```bash
mysql -u root -p evaccin_db -e "
  SELECT id, phone_number, failure_reason 
  FROM notifications 
  WHERE status = 'FAILED' 
  LIMIT 10;
"
```

---

## Tips & Tricks

### Utiliser des variables pour ne pas taper chaque fois

```bash
# Définir les variables
USER_ID="1"
PATIENT_ID="123"
PHONE="+221761234567"
GUARDIAN_NAME="Fatou Diallo"
VACCINE_NAME="BCG"

# Utiliser les variables
curl -X POST http://localhost:8080/api/notifications/vaccination-confirmation \
  -H "Content-Type: application/json" \
  -H "X-User-Id: $USER_ID" \
  -d '{
    "patientId": '$PATIENT_ID',
    "patientName": "Patient Name",
    "guardianPhone": "'$PHONE'",
    "guardianName": "'$GUARDIAN_NAME'",
    "vaccineName": "'$VACCINE_NAME'"
  }'
```

### Sauvegarder la réponse dans un fichier

```bash
curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{...}' > response.json

# Lire la réponse
cat response.json | python -m json.tool
```

### Faire des requêtes avec Postman/Insomnia

1. Créer une nouvelle requête POST
2. URL: `http://localhost:8080/api/notifications/send-sms`
3. Headers:
   - `Content-Type: application/json`
   - `X-User-Id: 1`
4. Body (raw JSON):
```json
{
  "patientId": 1,
  "phoneNumber": "+221761234567",
  "recipientName": "Test",
  "message": "Test message",
  "templateType": "CUSTOM"
}
```

---

## Dates en format ISO 8601

Pour les reminders, utilisez le format `YYYY-MM-DDTHH:MM:SS`

```bash
# Demain à 14:30
date -d "tomorrow 14:30" +%Y-%m-%dT%H:%M:%S

# Dans 3 jours à 10:00
date -d "+3 days 10:00" +%Y-%m-%dT%H:%M:%S

# Lundi prochain à 09:00
date -d "next monday 09:00" +%Y-%m-%dT%H:%M:%S

# Windows PowerShell
(Get-Date).AddDays(1).AddHours(14).AddMinutes(30).ToString("yyyy-MM-ddTHH:mm:ss")
```


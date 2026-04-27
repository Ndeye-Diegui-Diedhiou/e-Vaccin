# SMS Integration Quick Start Guide

Get SMS notifications working in 10 minutes! 🚀

---

## Step 1: Add Dependencies to `pom.xml`

```xml
<!-- Add to <dependencies> section -->
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>8.10.0</version>
</dependency>

<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.14</version>
</dependency>

<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.15.2</version>
</dependency>
```

Run:
```bash
mvn clean install
```

---

## Step 2: Create Database Table

Run this SQL in your MySQL database:

```sql
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    user_id BIGINT,
    phone_number VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
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
    
    CONSTRAINT fk_notification_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Step 3: Copy Source Files

Copy these Java files to your project:

```
src/main/java/com/evaccin/
├── model/
│   └── Notification.java
├── repository/
│   └── NotificationRepository.java
├── service/
│   ├── SmsNotificationService.java
│   └── sms/
│       ├── SmsProvider.java
│       ├── SmsStatus.java
│       ├── SmsException.java
│       └── provider/
│           ├── MockSmsProvider.java
│           └── TwilioSmsProvider.java
└── controller/
    └── NotificationController.java
```

---

## Step 4: Configure `application.properties`

For **development** (using Mock SMS):

```properties
app.sms.provider=mock
spring.task.execution.pool.core-size=2
spring.task.execution.pool.max-size=5
spring.task.scheduling.pool.size=2
```

For **production** (using Twilio):

```properties
app.sms.provider=twilio
app.sms.twilio.account-sid=${TWILIO_ACCOUNT_SID}
app.sms.twilio.auth-token=${TWILIO_AUTH_TOKEN}
app.sms.twilio.from-number=+221761234567

spring.task.execution.pool.core-size=2
spring.task.execution.pool.max-size=5
spring.task.scheduling.pool.size=2
```

---

## Step 5: Set Environment Variables (Production Only)

```bash
# Linux/Mac
export TWILIO_ACCOUNT_SID="ACxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_token_here"

# Windows
set TWILIO_ACCOUNT_SID=ACxxxxxxxxx
set TWILIO_AUTH_TOKEN=your_token_here
```

---

## Step 6: Enable Async Processing

Ensure `@EnableAsync` and `@EnableScheduling` are on your main application class:

```java
@SpringBootApplication
@EnableAsync
@EnableScheduling
public class EVaccinApplication {
    public static void main(String[] args) {
        SpringApplication.run(EVaccinApplication.class, args);
    }
}
```

---

## Step 7: Test SMS Sending

### Option A: Using cURL

```bash
# Send confirmation SMS
curl -X POST http://localhost:8080/api/notifications/vaccination-confirmation \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 1,
    "patientName": "Moussa Konaté",
    "guardianPhone": "+221761234567",
    "guardianName": "Fatou Diallo",
    "vaccineName": "BCG"
  }'
```

### Option B: From Java Code

```java
@RestController
@RequestMapping("/test")
public class TestController {
    
    @Autowired
    private SmsNotificationService smsNotificationService;
    
    @GetMapping("/send-test-sms")
    public ResponseEntity<?> sendTestSms() {
        smsNotificationService.sendVaccinationConfirmation(
            1L,                      // patientId
            "Moussa Konaté",        // patientName
            "+221761234567",        // guardianPhone
            "Fatou Diallo",         // guardianName
            "BCG",                  // vaccineName
            1L                      // userId
        );
        return ResponseEntity.ok("SMS sent!");
    }
}
```

Visit: `http://localhost:8080/test/send-test-sms`

---

## Step 8: Verify in Database

```sql
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
```

Expected output:
```
id | patientId | phone_number  | status | templateType | createdAt
1  | 1         | +221761234567 | SENT   | VACCINATION_CONFIRMATION | 2026-04-26 15:30:40
```

---

## Step 9: Integrate with VaccinationService

```java
@Service
public class VaccinationService {
    
    @Autowired
    private SmsNotificationService smsNotificationService;
    
    @Autowired
    private VaccinationRepository vaccinationRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    /**
     * Record vaccination and automatically send SMS confirmation
     */
    @Transactional
    public void recordVaccination(Vaccination vaccination, Long userId) {
        // 1. Save vaccination
        vaccinationRepository.save(vaccination);
        
        // 2. Get patient details
        Patient patient = patientRepository.findById(vaccination.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        // 3. Send SMS confirmation automatically
        smsNotificationService.sendVaccinationConfirmation(
            patient.getId(),
            patient.getFirstName() + " " + patient.getLastName(),
            patient.getGuardianPhone(),
            patient.getGuardianName(),
            vaccination.getVaccineName(),
            userId
        );
    }
}
```

---

## Step 10: Monitor SMS Status

```bash
# Check all sent SMS
curl http://localhost:8080/api/notifications/stats

# Check specific patient notifications
curl http://localhost:8080/api/notifications/patient/1

# Check specific notification status
curl http://localhost:8080/api/notifications/1
```

---

## Troubleshooting

### SMS Not Sending?

**Check 1:** Is mock provider working?
```bash
tail -f logs/spring.log | grep "Mock SMS"
```

**Check 2:** Is database configured?
```bash
mysql -u root -p evaccin_db -e "SELECT COUNT(*) FROM notifications;"
```

**Check 3:** Is async enabled?
```java
// Check for @EnableAsync in main application class
// Check logs for "Mock SMS sent to..."
```

### Twilio Not Working?

**Check 1:** Credentials set?
```bash
echo $TWILIO_ACCOUNT_SID
echo $TWILIO_AUTH_TOKEN
```

**Check 2:** Phone number valid?
- Must include country code: `+221...` (Senegal)
- Twilio trial accounts have limited numbers

**Check 3:** Check logs:
```bash
tail -f logs/spring.log | grep -i twilio
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "SMS provider not configured" | Missing app.sms.provider | Set `app.sms.provider=mock` in properties |
| `ClassNotFoundException: TwilioSmsProvider` | Missing dependency | Add Twilio SDK to pom.xml |
| "Notification table not found" | Missing database table | Run SQL migration script |
| SMS not appearing in DB | Async not enabled | Add `@EnableAsync` to main class |
| Scheduled reminders not sending | Scheduling not enabled | Add `@EnableScheduling` to main class |
| "Invalid phone number" | Bad format | Use format: +[country][number] |

---

## Next Steps

1. **Test with Mock Provider** (development)
2. **Integrate with real Twilio account** (production)
3. **Set up monitoring** for failed messages
4. **Configure SMS templates** for your use cases
5. **Train team** on SMS workflow

---

## Support

📧 Issues? Check: `logs/spring.log`
📱 Questions? Review: `SMS_INTEGRATION.md`
🔧 Config help? See: `SMS_CONFIG.properties`

---

## Timeline

- **5 mins:** Copy source files
- **2 mins:** Add Maven dependencies  
- **2 mins:** Create database table
- **1 min:** Configure application.properties
- **Total:** ~10 minutes ✅

Good luck! 🚀


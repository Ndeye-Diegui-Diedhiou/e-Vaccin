# SMS Integration Guide - e-Vaccin Platform

## Overview

Complete SMS notification system for sending vaccination confirmations, reminders, and alerts to patient guardians.

**Key Features:**
- ✅ Async SMS sending (non-blocking)
- ✅ Automatic retry logic for failed messages
- ✅ Scheduled message sending
- ✅ Multiple SMS provider support (Twilio, Mock)
- ✅ Complete audit trail
- ✅ Message templates
- ✅ Rate limiting aware

---

## Architecture

### Layer Pattern

```
NotificationController (REST Endpoints)
          ↓
SmsNotificationService (Business Logic + Scheduling)
          ↓
SmsProvider Interface (Abstraction)
          ↓
- TwilioSmsProvider (Implementation)
- MockSmsProvider (Testing)
          ↓
NotificationRepository (JDBC Data Access)
          ↓
notifications (MySQL Table)
```

---

## Configuration

### 1. Application Properties

Add to `application.properties`:

```properties
# SMS Provider Configuration
# Options: "twilio", "mock" (default for development)
app.sms.provider=mock

# Twilio Configuration (if using Twilio)
app.sms.twilio.account-sid=${TWILIO_ACCOUNT_SID}
app.sms.twilio.auth-token=${TWILIO_AUTH_TOKEN}
app.sms.twilio.from-number=+221761234567

# SMS Configuration
app.sms.max-retries=3
app.sms.retry-interval=300000  # 5 minutes in milliseconds

# Enable async processing
spring.task.execution.pool.core-size=2
spring.task.execution.pool.max-size=5
spring.task.execution.pool.queue-capacity=100

# Enable scheduling
spring.task.scheduling.pool.size=2
```

### 2. Environment Variables

For production, use environment variables:

```bash
export TWILIO_ACCOUNT_SID="your_account_sid_here"
export TWILIO_AUTH_TOKEN="your_auth_token_here"
```

### 3. Database Setup

Run the migration script to create the notifications table:

```sql
-- From notification-schema.sql
CREATE TABLE notifications (
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
    ...
);
```

### 4. Maven Dependencies

```xml
<!-- Twilio SMS API (optional) -->
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>8.10.0</version>
</dependency>

<!-- Spring Web for RestTemplate -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Context for async/scheduling -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
</dependency>
```

---

## Usage Examples

### 1. Send Vaccination Confirmation

**Endpoint:** `POST /api/notifications/vaccination-confirmation`

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

**Response:**
```json
{
  "success": true,
  "message": "Vaccination confirmation SMS sent",
  "data": null
}
```

### 2. Send Vaccination Reminder (Scheduled)

**Endpoint:** `POST /api/notifications/vaccination-reminder`

```bash
curl -X POST http://localhost:8080/api/notifications/vaccination-reminder \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 123,
    "patientName": "Moussa Konaté",
    "guardianPhone": "+221761234567",
    "guardianName": "Fatou Diallo",
    "vaccineName": "Polio 1",
    "appointmentTime": "2026-05-10T14:30:00",
    "appointmentLocation": "Clinique Dia Dakar"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Vaccination reminder scheduled",
  "data": null
}
```

*Note: Reminder will be sent automatically 24 hours before appointment time.*

### 3. Send Urgent Alert

**Endpoint:** `POST /api/notifications/alert`

```bash
curl -X POST http://localhost:8080/api/notifications/alert \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 123,
    "patientName": "Moussa Konaté",
    "guardianPhone": "+221761234567",
    "guardianName": "Fatou Diallo",
    "reason": "Vaccination urgently needed - outbreak detected"
  }'
```

### 4. Send Generic SMS

**Endpoint:** `POST /api/notifications/send-sms`

```bash
curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 123,
    "phoneNumber": "+221761234567",
    "recipientName": "Fatou Diallo",
    "message": "Custom message content",
    "templateType": "CUSTOM"
  }'
```

### 5. Get Notification Status

**Endpoint:** `GET /api/notifications/{id}`

```bash
curl -X GET http://localhost:8080/api/notifications/1
```

**Response:**
```json
{
  "success": true,
  "message": "Notification found",
  "data": {
    "id": 1,
    "patientId": 123,
    "phoneNumber": "+221761234567",
    "recipientName": "Fatou Diallo",
    "message": "Bonjour Fatou Diallo, Confirmation de vaccination...",
    "templateType": "VACCINATION_CONFIRMATION",
    "status": "SENT",
    "retryCount": 0,
    "providerReference": "SM1234567890abcdef",
    "sentTime": "2026-04-26T15:30:45",
    "createdAt": "2026-04-26T15:30:40"
  }
}
```

### 6. Get Patient Notifications

**Endpoint:** `GET /api/notifications/patient/{patientId}`

```bash
curl -X GET http://localhost:8080/api/notifications/patient/123
```

**Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved",
  "data": [
    {
      "id": 1,
      "status": "SENT",
      "templateType": "VACCINATION_CONFIRMATION",
      "message": "..."
    },
    {
      "id": 2,
      "status": "SENT",
      "templateType": "VACCINATION_REMINDER",
      "message": "..."
    }
  ]
}
```

### 7. Get Statistics

**Endpoint:** `GET /api/notifications/stats`

```bash
curl -X GET http://localhost:8080/api/notifications/stats
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "total": 1250,
    "sent": 1180,
    "failed": 70
  }
}
```

---

## Java Service Usage

### In Your Vaccination Service

```java
@Service
public class VaccinationService {
    
    @Autowired
    private SmsNotificationService smsNotificationService;
    
    @Autowired
    private VaccinationRepository vaccinationRepository;
    
    /**
     * Record vaccination and send confirmation
     */
    @Transactional
    public void recordVaccination(Vaccination vaccination, Long userId) {
        // Save vaccination
        vaccinationRepository.save(vaccination);
        
        // Get patient details (from repository)
        Patient patient = patientRepository.findById(vaccination.getPatientId()).get();
        
        // Send confirmation SMS asynchronously
        smsNotificationService.sendVaccinationConfirmation(
            patient.getId(),
            patient.getFirstName() + " " + patient.getLastName(),
            patient.getGuardianPhone(),
            patient.getGuardianName(),
            vaccination.getVaccineName(),
            userId
        );
        
        // Audit log
        auditLog.log(userId, "VACCINATION_RECORDED", patient.getId());
    }
}
```

### In Your Patient Controller

```java
@PostMapping("/{patientId}/vaccinations")
public ResponseEntity<?> recordVaccination(
        @PathVariable Long patientId,
        @RequestBody Vaccination vaccination,
        @RequestHeader(value = "X-User-Id") Long userId) {
    
    vaccination.setPatientId(patientId);
    
    // This automatically sends SMS via the service
    vaccinationService.recordVaccination(vaccination, userId);
    
    return ResponseEntity.ok(new ApiResponse(true, "Vaccination recorded", null));
}
```

---

## SMS Providers

### Option 1: Twilio (Production Recommended)

**Advantages:**
- Reliable delivery
- Global SMS support
- Rich API
- Good documentation
- Competitive pricing

**Setup:**

1. Create account at [twilio.com](https://twilio.com)
2. Get Account SID and Auth Token
3. Get a phone number
4. Set environment variables:
   ```bash
   export TWILIO_ACCOUNT_SID="ACxxxxxxxxx"
   export TWILIO_AUTH_TOKEN="your_token"
   ```
5. Update `application.properties`:
   ```properties
   app.sms.provider=twilio
   app.sms.twilio.from-number=+1234567890
   ```

**Cost:** ~$0.0075 per SMS in Senegal

### Option 2: Mock Provider (Development)

**Use for:** Development and testing

**Configuration:**
```properties
app.sms.provider=mock
```

**Behavior:**
- Simulates SMS sending
- Logs to console/file
- 80% success rate (simulates real failures)
- Uses mock message IDs
- No API calls made

**Perfect for:**
- Local development
- Unit testing
- Integration testing without SMS costs

### Option 3: Custom Provider

To add another SMS provider:

1. Create class implementing `SmsProvider`:

```java
@Component
@ConditionalOnProperty(name = "app.sms.provider", havingValue = "myapi")
public class MyApiSmsProvider implements SmsProvider {
    
    @Override
    public String sendSms(String phoneNumber, String message) throws SmsException {
        // Implement your API call here
        return providerMessageId;
    }
    
    @Override
    public String getProviderName() {
        return "My Custom SMS API";
    }
    
    // Implement other methods...
}
```

2. Update `application.properties`:
```properties
app.sms.provider=myapi
```

---

## Scheduled Tasks

### 1. Retry Failed Messages

**Runs:** Every 5 minutes
**Function:** Retries up to 3 failed messages automatically
**Configuration:** 
```properties
# Interval in milliseconds (300000 = 5 minutes)
app.sms.retry-interval=300000
```

### 2. Send Scheduled Messages

**Runs:** Every minute
**Function:** Checks for messages scheduled to send and sends them
**Example:** Reminders scheduled 24 hours before vaccination

---

## Message Templates

### Template Types

| Type | Purpose | Auto-Send | Example |
|------|---------|-----------|---------|
| `VACCINATION_CONFIRMATION` | Confirm vaccination recorded | Immediate | "Vaccination de BCG confirmée..." |
| `VACCINATION_REMINDER` | Remind of upcoming appointment | Scheduled 24h before | "Rappel: Vaccination demain..." |
| `ALERT` | Urgent message | Immediate | "⚠️ ALERTE VACCINATION..." |
| `CUSTOM` | User-defined message | Manual | Any message |

### Customizing Templates

Edit `SmsNotificationService`:

```java
public void sendVaccinationConfirmation(...) {
    String message = String.format(
        "Bonjour %s,\n\n" +
        "Votre enfant %s a reçu le vaccin %s le %s.\n\n" +
        "Prochaine visite: [DATE]\n" +
        "Questions? Appelez-nous au [PHONE]\n\n" +
        "e-Vaccin Senegal",
        guardianName, patientName, vaccineName, LocalDate.now()
    );
}
```

---

## Error Handling

### Retryable Errors
Automatically retried (up to 3 times):
- `RATE_LIMIT` - API rate limit hit
- `TIMEOUT` - Network timeout
- `SERVICE_UNAVAILABLE` - Provider temporarily down
- `TEMPORARY_FAILURE` - Transient error

### Non-Retryable Errors
Marked as failed immediately:
- `NOT_CONFIGURED` - SMS provider not set up
- `INVALID_PHONE` - Bad phone number
- `API_ERROR` - Permanent API error
- `SEND_FAILED` - Unknown send failure

### Monitoring Errors

```bash
# Check failed notifications
SELECT * FROM notifications WHERE status = 'FAILED' ORDER BY created_at DESC;

# Check retry attempts
SELECT * FROM notifications WHERE retry_count > 0;

# Check statistics
SELECT status, COUNT(*) as count FROM notifications GROUP BY status;
```

---

## Performance Considerations

### Database Indexes
Notifications table has indexes on:
- `patient_id` - For finding patient notifications
- `status` - For finding pending/failed messages
- `created_at` - For sorting and time-based queries
- `scheduled_time` - For scheduled message retrieval
- `template_type` - For filtering by message type

### Async Processing
- SMS sending doesn't block API requests
- Uses `@Async` for non-blocking execution
- Thread pool size: 2-5 concurrent tasks
- Queue capacity: 100 messages

### Connection Pooling
- HikariCP manages database connections
- Max connections: 10
- Timeout: 30 seconds

---

## Testing

### Unit Test Example

```java
@SpringBootTest
public class SmsNotificationServiceTest {
    
    @Autowired
    private SmsNotificationService smsNotificationService;
    
    @MockBean
    private SmsProvider smsProvider;
    
    @Test
    public void testSendVaccinationConfirmation() throws SmsException {
        when(smsProvider.sendSms(anyString(), anyString()))
            .thenReturn("MOCK_MSG_ID_12345");
        
        smsNotificationService.sendVaccinationConfirmation(
            1L, "Test Child", "+221761234567", "Test Guardian", "BCG", 1L
        );
        
        verify(smsProvider, times(1)).sendSms(anyString(), anyString());
    }
}
```

### Integration Test Example

```java
@SpringBootTest
@AutoConfigureMockMvc
public class NotificationControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    public void testSendSmsEndpoint() throws Exception {
        mockMvc.perform(post("/api/notifications/send-sms")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"patientId\":1,\"phoneNumber\":\"+221761234567\",...}")
            .header("X-User-Id", "1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }
}
```

---

## Logging

### Enable Debug Logging

Add to `application.properties`:

```properties
logging.level.com.evaccin.service.SmsNotificationService=DEBUG
logging.level.com.evaccin.service.sms.provider=DEBUG
logging.level.com.evaccin.repository.NotificationRepository=DEBUG
```

### Log Output

```
[INFO] Mock SMS sent to +221761234567
[INFO] SMS sent successfully. Reference: MOCK_abc123def456
[INFO] Vaccination confirmation scheduled for patient 123
[DEBUG] Message: Bonjour Fatou Diallo...
[WARN] Notification 456 marked for retry (1/3)
```

---

## Production Checklist

- [ ] Configure real SMS provider (Twilio)
- [ ] Set environment variables securely
- [ ] Configure database connection pooling
- [ ] Set up monitoring/alerting for failed messages
- [ ] Enable SSL/TLS for API calls
- [ ] Configure log aggregation
- [ ] Test with real phone numbers
- [ ] Set up scheduled backup of notifications table
- [ ] Document support procedures
- [ ] Train team on message templates
- [ ] Set up rate limiting on endpoints
- [ ] Configure CORS properly
- [ ] Enable audit logging

---

## Troubleshooting

### SMS Not Sending

**Check 1:** Is SMS provider configured?
```bash
curl http://localhost:8080/api/notifications/stats
# If error: Check application.properties
```

**Check 2:** Is database accessible?
```bash
mysql -u root -p evaccin_db -e "SELECT COUNT(*) FROM notifications;"
```

**Check 3:** Check logs for errors
```bash
tail -f logs/spring.log | grep SMS
tail -f logs/spring.log | grep Notification
```

### High Failure Rate

**Possible causes:**
- Invalid phone numbers (missing country code)
- SMS provider rate limits
- Network connectivity issues
- Invalid provider credentials

**Solution:**
```sql
-- Find failed notifications
SELECT id, phone_number, failure_reason, created_at 
FROM notifications 
WHERE status = 'FAILED' 
ORDER BY created_at DESC 
LIMIT 20;
```

### Scheduled Messages Not Sending

**Check:** Are scheduled tasks running?
```properties
# Enable scheduling
spring.task.scheduling.pool.size=2
```

**Check:** Message scheduled time
```sql
SELECT * FROM notifications 
WHERE status = 'PENDING' 
AND scheduled_time IS NOT NULL;
```

---

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/notifications/send-sms` | POST | Send custom SMS |
| `/api/notifications/vaccination-confirmation` | POST | Send confirmation |
| `/api/notifications/vaccination-reminder` | POST | Schedule reminder |
| `/api/notifications/alert` | POST | Send alert |
| `/api/notifications/{id}` | GET | Get notification status |
| `/api/notifications/patient/{patientId}` | GET | Get patient notifications |
| `/api/notifications/stats` | GET | Get statistics |

---

## Support

For issues or questions:
1. Check logs: `logs/spring.log`
2. Review database: `notifications` table
3. Test with mock provider first
4. Contact: support@evaccin.sn


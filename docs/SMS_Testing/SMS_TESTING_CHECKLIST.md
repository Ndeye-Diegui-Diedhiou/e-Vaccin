# 🚀 SMS Testing - Quick Start Checklist

Print this page or screenshot it - complete it as you go!

---

## ✅ Phase 1: Preparation (5 minutes)

- [ ] Backend code cloned from Git
- [ ] Backend directory: `backend/` exists
- [ ] MySQL server running
  - [ ] Test: `mysql -u root -p -e "SELECT 1;"`
- [ ] Java 11+ installed
  - [ ] Test: `java -version`
- [ ] Maven installed
  - [ ] Test: `mvn --version`

---

## ✅ Phase 2: Configuration (5 minutes)

### Mock Provider (Development)
```bash
# Add to backend/src/main/resources/application.properties
app.sms.provider=mock
```
- [ ] Configuration added

### OR Twilio Provider (Production)
```bash
# Set environment variables
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxx"
export TWILIO_AUTH_TOKEN="your_auth_token"
```
- [ ] Credentials obtained from Twilio
- [ ] Environment variables set

---

## ✅ Phase 3: Database Setup (2 minutes)

Run SQL migration:
```sql
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
    INDEX idx_created_at (created_at)
);
```

- [ ] SQL executed successfully
- [ ] Table created

---

## ✅ Phase 4: Start Backend (3 minutes)

```bash
cd backend
mvn clean spring-boot:run
```

Wait for output like:
```
[INFO] Started Application in X seconds
[INFO] SMS provider initialized: Mock
[INFO] Async executor initialized
[INFO] Scheduled task initialized
```

- [ ] Backend started
- [ ] Port 8080 accessible
- [ ] No ERROR messages
- [ ] SMS provider visible in logs

---

## ✅ Phase 5: Quick API Test (1 minute)

```bash
# Test API is responding
curl http://localhost:8080/api/notifications/stats

# Should return:
# {"success":true,"message":"Statistics retrieved","data":{"total":0,"sent":0,"failed":0}}
```

- [ ] API responds with 200 OK
- [ ] JSON response valid
- [ ] Stats show 0 notifications initially

---

## ✅ Phase 6: Run Automated Tests (5 minutes)

### Windows (PowerShell)
```powershell
cd e-vaccin
.\sms-test.ps1 -Provider "mock" -Verbose
```

### Linux/Mac (Bash)
```bash
cd e-vaccin
chmod +x sms-test.sh
./sms-test.sh --provider=mock
```

Expected output:
```
═══════════════════════════════════════════════════════════════
                    TEST SUMMARY
═══════════════════════════════════════════════════════════════

Total Tests: 30
Passed: 30
Failed: 0

✓ All tests passed! SMS integration is working correctly.
```

- [ ] Test script executed
- [ ] All 30 tests passed
- [ ] 0 failures
- [ ] Performance confirmed (SMS < 2 seconds)

---

## ✅ Phase 7: Verify Results (3 minutes)

### In Database
```sql
SELECT status, COUNT(*) FROM notifications GROUP BY status;
```

Expected:
```
| status  | count |
|---------|-------|
| SENT    | 27    |
| FAILED  | 2     |
| PENDING | 1     |
```

- [ ] Total SMS matches test output (>20)
- [ ] Most are SENT
- [ ] Few FAILED (1-3)

### In Logs
```bash
# Windows PowerShell
Get-Content logs/spring.log -Tail 50 | Select-String "SMS"

# Linux/Mac
tail -50 logs/spring.log | grep -i SMS
```

Should show:
- `SMS sent successfully`
- `Async executor` messages
- No ERROR messages

- [ ] Logs show successful SMS
- [ ] No ERROR or WARN
- [ ] Async processing visible

### In Browser
Visit: `http://localhost:8080/api/notifications/stats`

Should show:
```json
{
  "success": true,
  "message": "Statistics retrieved",
  "data": {
    "total": 30,
    "sent": 27,
    "failed": 2
  }
}
```

- [ ] Stats API working
- [ ] Counts accurate
- [ ] JSON valid

---

## ✅ Phase 8: Manual Testing (Optional, 5 minutes)

Pick ONE test from [SMS_CURL_EXAMPLES.md](SMS_CURL_EXAMPLES.md):

```bash
# Example: Send custom SMS
curl -X POST http://localhost:8080/api/notifications/send-sms \
  -H "Content-Type: application/json" \
  -H "X-User-Id: 1" \
  -d '{
    "patientId": 999,
    "phoneNumber": "+221761234567",
    "recipientName": "Manual Test",
    "message": "Manual test SMS",
    "templateType": "CUSTOM"
  }'

# Should return: {"success":true,"message":"SMS sent"}
```

- [ ] Request executed
- [ ] Response 200 OK
- [ ] Message in database

---

## 🎯 Success Criteria Met?

| Criterion | Check |
|-----------|-------|
| Backend runs without errors | ✅ Backend Phase 4 |
| API responds to requests | ✅ Phase 5 |
| Automated tests pass 100% | ✅ Phase 6 |
| 25+ SMS created in database | ✅ Phase 7 |
| Logs show no errors | ✅ Phase 7 |
| Stats API returns correct data | ✅ Phase 7 |
| Manual test successful | ✅ Phase 8 |

---

## 📊 Time Summary

| Phase | Time | Status |
|-------|------|--------|
| 1. Preparation | 5 min | ⏱️ |
| 2. Configuration | 5 min | ⏱️ |
| 3. Database | 2 min | ⏱️ |
| 4. Start Backend | 3 min | ⏱️ |
| 5. Quick Test | 1 min | ⏱️ |
| 6. Automated Tests | 5 min | ⏱️ |
| 7. Verify | 3 min | ⏱️ |
| 8. Manual (Optional) | 5 min | ⏱️ |
| **TOTAL** | **~30 min** | ✅ |

---

## 🎉 COMPLETE!

If all checkboxes are checked:

✅ **SMS Integration is WORKING!**

---

## 🔧 Troubleshooting Quick Links

### Problem: Backend won't start
- Check: MySQL running?
- Check: Port 8080 not in use?
- Read: [SMS_QUICKSTART_SETUP.md](SMS_QUICKSTART_SETUP.md)

### Problem: Tests fail
- Run: One test at a time from [SMS_CURL_EXAMPLES.md](SMS_CURL_EXAMPLES.md)
- Check: Logs in `logs/spring.log`
- Read: [SMS_TESTING_COMPLETE_GUIDE.md](SMS_TESTING_COMPLETE_GUIDE.md#troubleshooting)

### Problem: Database empty
- Check: SQL migration executed?
- Check: Backend restarted after table creation?
- Run: `mysql -u root -p evaccin_db -e "DESCRIBE notifications;"`

### Problem: API returns 404
- Check: Backend running on 8080?
- Check: `/api` prefix correct?
- Test: `curl http://localhost:8080/api/notifications/stats`

---

## 📚 Documentation Reference

| Question | Reference |
|----------|-----------|
| How to configure? | [SMS_QUICKSTART_SETUP.md](SMS_QUICKSTART_SETUP.md) |
| How to test step-by-step? | [SMS_TESTING_COMPLETE_GUIDE.md](SMS_TESTING_COMPLETE_GUIDE.md) |
| Need cURL examples? | [SMS_CURL_EXAMPLES.md](SMS_CURL_EXAMPLES.md) |
| Technical details? | [SMS_INTEGRATION.md](SMS_INTEGRATION.md) |
| Lost? | [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) |

---

## 🚀 Next Steps After Success

### For Development
1. Explore [SMS_CURL_EXAMPLES.md](SMS_CURL_EXAMPLES.md)
2. Create custom endpoints
3. Integrate with vaccination service

### For Production
1. Setup Twilio provider
2. Test with real numbers
3. Enable monitoring
4. Deploy to server

### For Learning
1. Review [SMS_INTEGRATION.md](SMS_INTEGRATION.md)
2. Study architecture
3. Customize templates
4. Add more providers

---

## 💡 Pro Tips

1. **Save this checklist** - Use it every time you test
2. **Use automated script** - Fastest way to validate (5 min)
3. **Check logs often** - Most issues visible in logs
4. **Keep database clean** - Delete test records: `DELETE FROM notifications WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 DAY);`
5. **Monitor performance** - Watch for slow queries in database

---

## 📞 Still Need Help?

1. **Specific error message?** → Search [SMS_TESTING_COMPLETE_GUIDE.md](SMS_TESTING_COMPLETE_GUIDE.md#troubleshooting)
2. **Want to copy command?** → Find it in [SMS_CURL_EXAMPLES.md](SMS_CURL_EXAMPLES.md)
3. **Understand architecture?** → Read [SMS_INTEGRATION.md](SMS_INTEGRATION.md)
4. **Lost in docs?** → Use [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

---

## ✨ Final Checklist

Before declaring success:

- [ ] All 8 phases completed
- [ ] 0 failed tests
- [ ] Database populated with SMS
- [ ] Logs show no errors
- [ ] Manual test passed
- [ ] Stats API accurate
- [ ] Documentation reviewed
- [ ] Next steps identified

---

**Estimated Time to Full Validation:** 30-45 minutes

**Print This → Complete It → Success! 🎉**

---

Last Updated: April 27, 2026

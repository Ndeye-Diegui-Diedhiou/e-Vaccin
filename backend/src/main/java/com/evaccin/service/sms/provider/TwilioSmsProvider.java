package com.evaccin.service.sms.provider;

import com.evaccin.service.sms.SmsException;
import com.evaccin.service.sms.SmsProvider;
import com.evaccin.service.sms.SmsStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import java.util.Base64;

/**
 * Twilio SMS Provider Implementation
 * Sends SMS via Twilio API
 * 
 * Configuration in application.properties:
 * - app.sms.provider=twilio
 * - app.sms.twilio.account-sid=YOUR_ACCOUNT_SID
 * - app.sms.twilio.auth-token=YOUR_AUTH_TOKEN
 * - app.sms.twilio.from-number=+221761234567
 */
@Component
@ConditionalOnProperty(name = "app.sms.provider", havingValue = "twilio")
public class TwilioSmsProvider implements SmsProvider {

    @Value("${app.sms.twilio.account-sid}")
    private String accountSid;

    @Value("${app.sms.twilio.auth-token}")
    private String authToken;

    @Value("${app.sms.twilio.from-number}")
    private String fromNumber;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String TWILIO_API_URL = "https://api.twilio.com/2010-04-01/Accounts/{0}/Messages.json";

    @Override
    public String sendSms(String phoneNumber, String message) throws SmsException {
        if (!isAvailable()) {
            throw new SmsException("Twilio provider not configured", "NOT_CONFIGURED");
        }

        try {
            String url = TWILIO_API_URL.replace("{0}", accountSid);
            
            // Prepare form data
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("From", fromNumber);
            body.add("To", phoneNumber);
            body.add("Body", message);

            // Prepare headers with Basic Auth
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            String auth = accountSid + ":" + authToken;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            // Send request
            TwilioResponse response = restTemplate.postForObject(url, request, TwilioResponse.class);

            if (response != null && response.sid != null) {
                return response.sid;
            } else {
                throw new SmsException("Failed to send SMS via Twilio", "API_ERROR");
            }
        } catch (Exception e) {
            throw new SmsException("Twilio SMS sending failed: " + e.getMessage(), "SEND_FAILED", e);
        }
    }

    @Override
    public String sendSmsTemplate(String phoneNumber, String templateId, String... variables) {
        // Twilio doesn't have built-in templates, so we would construct message from template
        // This is a placeholder - implement based on your template engine
        return null;
    }

    @Override
    public SmsStatus checkStatus(String providerReference) throws SmsException {
        try {
            String url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + 
                        "/Messages/" + providerReference + ".json";

            // Similar implementation to get message status
            // This would require another REST call with authentication
            return SmsStatus.UNKNOWN;
        } catch (Exception e) {
            throw new SmsException("Failed to check SMS status", "STATUS_CHECK_FAILED", e);
        }
    }

    @Override
    public String getProviderName() {
        return "Twilio";
    }

    @Override
    public boolean isAvailable() {
        return accountSid != null && !accountSid.isEmpty() &&
               authToken != null && !authToken.isEmpty() &&
               fromNumber != null && !fromNumber.isEmpty();
    }

    /**
     * Twilio API Response DTO
     */
    public static class TwilioResponse {
        public String sid;
        public String status;
        public String errorCode;
        public String errorMessage;
    }
}

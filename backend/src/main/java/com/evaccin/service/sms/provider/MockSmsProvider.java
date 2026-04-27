package com.evaccin.service.sms.provider;

import com.evaccin.service.sms.SmsException;
import com.evaccin.service.sms.SmsProvider;
import com.evaccin.service.sms.SmsStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Mock SMS Provider for Development/Testing
 * Simulates SMS sending without making real API calls
 * 
 * Configuration in application.properties:
 * - app.sms.provider=mock
 */
@Component
@ConditionalOnProperty(name = "app.sms.provider", havingValue = "mock", matchIfMissing = true)
public class MockSmsProvider implements SmsProvider {

    private static final Logger logger = LoggerFactory.getLogger(MockSmsProvider.class);

    @Override
    public String sendSms(String phoneNumber, String message) throws SmsException {
        // Simulate successful send 80% of the time
        if (Math.random() > 0.8) {
            logger.warn("Mock SMS FAILED to {}: {}", phoneNumber, message);
            throw new SmsException("Mock SMS sending simulated failure", "MOCK_FAILURE");
        }

        String messageId = "MOCK_" + UUID.randomUUID().toString();
        logger.info("Mock SMS sent to {}", phoneNumber);
        logger.debug("Message: {}", message);
        logger.debug("Message ID: {}", messageId);

        return messageId;
    }

    @Override
    public String sendSmsTemplate(String phoneNumber, String templateId, String... variables) throws SmsException {
        String message = "[Template: " + templateId + "]";
        logger.info("Mock SMS Template sent to {} with template {}", phoneNumber, templateId);
        return "MOCK_TEMPLATE_" + UUID.randomUUID().toString();
    }

    @Override
    public SmsStatus checkStatus(String providerReference) throws SmsException {
        // Mock always returns delivered for MOCK messages
        if (providerReference != null && providerReference.startsWith("MOCK_")) {
            return SmsStatus.DELIVERED;
        }
        return SmsStatus.UNKNOWN;
    }

    @Override
    public String getProviderName() {
        return "Mock SMS Provider (Development)";
    }

    @Override
    public boolean isAvailable() {
        return true; // Always available in dev
    }
}

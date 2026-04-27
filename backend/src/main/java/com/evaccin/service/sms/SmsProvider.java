package com.evaccin.service.sms;

/**
 * SmsProvider Interface
 * Abstraction for different SMS providers (Twilio, AWS SNS, OVH, etc.)
 * Allows switching between providers without changing business logic
 */
public interface SmsProvider {
    
    /**
     * Send SMS message
     * @param phoneNumber Recipient phone number (with country code, e.g., +221761234567)
     * @param message SMS message content
     * @return Provider reference ID for tracking
     * @throws SmsException if sending fails
     */
    String sendSms(String phoneNumber, String message) throws SmsException;

    /**
     * Send SMS with template variables
     */
    String sendSmsTemplate(String phoneNumber, String templateId, String... variables) throws SmsException;

    /**
     * Check message status
     */
    SmsStatus checkStatus(String providerReference) throws SmsException;

    /**
     * Get provider name
     */
    String getProviderName();

    /**
     * Check if provider is configured and available
     */
    boolean isAvailable();
}

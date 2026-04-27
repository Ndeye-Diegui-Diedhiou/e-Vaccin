package com.evaccin.service.sms;

/**
 * SMS Status enum
 * Tracks the current state of an SMS message
 */
public enum SmsStatus {
    PENDING("Message pending delivery"),
    SENT("Message sent successfully"),
    DELIVERED("Message delivered to recipient"),
    FAILED("Message delivery failed"),
    BOUNCED("Message bounced/invalid number"),
    UNKNOWN("Status unknown");

    private final String description;

    SmsStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}

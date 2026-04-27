package com.evaccin.model;

import java.time.LocalDateTime;

/**
 * Notification Model - Tracks SMS notifications sent to guardians
 * Used for vaccination reminders, confirmations, and alerts
 */
public class Notification {
    private Long id;
    private Long patientId;
    private Long userId; // User who triggered the notification
    private String phoneNumber;
    private String recipientName;
    private String message;
    private String templateType; // VACCINATION_CONFIRMATION, VACCINATION_REMINDER, ALERT
    private String status; // PENDING, SENT, FAILED, RETRYING
    private Integer retryCount;
    private Integer maxRetries;
    private String providerReference; // ID from SMS provider (Twilio, AWS SNS, etc.)
    private String failureReason;
    private LocalDateTime scheduledTime;
    private LocalDateTime sentTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Notification() {}

    public Notification(Long patientId, String phoneNumber, String recipientName, 
                       String message, String templateType) {
        this.patientId = patientId;
        this.phoneNumber = phoneNumber;
        this.recipientName = recipientName;
        this.message = message;
        this.templateType = templateType;
        this.status = "PENDING";
        this.retryCount = 0;
        this.maxRetries = 3;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTemplateType() { return templateType; }
    public void setTemplateType(String templateType) { this.templateType = templateType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getRetryCount() { return retryCount; }
    public void setRetryCount(Integer retryCount) { this.retryCount = retryCount; }

    public Integer getMaxRetries() { return maxRetries; }
    public void setMaxRetries(Integer maxRetries) { this.maxRetries = maxRetries; }

    public String getProviderReference() { return providerReference; }
    public void setProviderReference(String providerReference) { this.providerReference = providerReference; }

    public String getFailureReason() { return failureReason; }
    public void setFailureReason(String failureReason) { this.failureReason = failureReason; }

    public LocalDateTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalDateTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public LocalDateTime getSentTime() { return sentTime; }
    public void setSentTime(LocalDateTime sentTime) { this.sentTime = sentTime; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "Notification{" +
                "id=" + id +
                ", patientId=" + patientId +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", templateType='" + templateType + '\'' +
                ", status='" + status + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}

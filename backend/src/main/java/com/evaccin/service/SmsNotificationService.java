package com.evaccin.service;

import com.evaccin.model.Notification;
import com.evaccin.repository.NotificationRepository;
import com.evaccin.service.sms.SmsException;
import com.evaccin.service.sms.SmsProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * SmsNotificationService - Core SMS sending service
 * Handles notification sending, retries, scheduling, and templates
 * 
 * Features:
 * - Async SMS sending to prevent blocking requests
 * - Automatic retry logic for failed messages
 * - Scheduled message sending
 * - Template support for common message types
 * - Audit trail via Notification records
 */
@Service
public class SmsNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(SmsNotificationService.class);

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SmsProvider smsProvider;

    /**
     * Send vaccination confirmation SMS to guardian
     */
    @Async
    @Transactional
    public void sendVaccinationConfirmation(Long patientId, String patientName, 
                                           String guardianPhone, String guardianName, 
                                           String vaccineName, Long userId) {
        try {
            String message = String.format(
                    "Bonjour %s,\n\n" +
                    "Confirmation de vaccination pour %s.\n" +
                    "Vaccin: %s\n" +
                    "Date: %s\n\n" +
                    "Merci d'utiliser e-Vaccin.\n" +
                    "🩹 e-Vaccin Senegal",
                    guardianName, patientName, vaccineName, LocalDateTime.now().toLocalDate()
            );

            sendSms(patientId, guardianPhone, guardianName, message, 
                   "VACCINATION_CONFIRMATION", userId);
        } catch (Exception e) {
            logger.error("Failed to send vaccination confirmation SMS", e);
        }
    }

    /**
     * Send vaccination reminder SMS (24 hours before)
     */
    @Async
    @Transactional
    public void sendVaccinationReminder(Long patientId, String patientName,
                                       String guardianPhone, String guardianName,
                                       String vaccineName, LocalDateTime appointmentTime,
                                       String appointmentLocation, Long userId) {
        try {
            String message = String.format(
                    "Rappel: Vaccination demain à %s\n" +
                    "Enfant: %s\n" +
                    "Vaccin: %s\n" +
                    "Lieu: %s\n\n" +
                    "Veuillez confirmer votre présence.\n" +
                    "e-Vaccin Senegal",
                    appointmentTime.toLocalTime(), patientName, vaccineName, appointmentLocation
            );

            Notification notification = new Notification(
                    patientId, guardianPhone, guardianName, message, "VACCINATION_REMINDER"
            );
            notification.setScheduledTime(appointmentTime.minusHours(24));
            notification.setUserId(userId);

            notificationRepository.save(notification);
            logger.info("Vaccination reminder scheduled for patient {}", patientId);
        } catch (Exception e) {
            logger.error("Failed to schedule vaccination reminder", e);
        }
    }

    /**
     * Send alert SMS (urgent vaccination needed)
     */
    @Async
    @Transactional
    public void sendVaccinationAlert(Long patientId, String patientName,
                                    String guardianPhone, String guardianName,
                                    String urgencyReason, Long userId) {
        try {
            String message = String.format(
                    "⚠️ ALERTE VACCINATION ⚠️\n" +
                    "Enfant: %s\n" +
                    "Raison: %s\n\n" +
                    "Action requise urgente.\n" +
                    "Contactez la clinique.\n" +
                    "e-Vaccin Senegal",
                    patientName, urgencyReason
            );

            sendSms(patientId, guardianPhone, guardianName, message, "ALERT", userId);
        } catch (Exception e) {
            logger.error("Failed to send vaccination alert", e);
        }
    }

    /**
     * Generic SMS sending method
     */
    @Async
    @Transactional
    public void sendSms(Long patientId, String phoneNumber, String recipientName,
                        String message, String templateType, Long userId) {
        try {
            // Create notification record
            Notification notification = new Notification(
                    patientId, phoneNumber, recipientName, message, templateType
            );
            notification.setUserId(userId);
            notification = notificationRepository.save(notification);

            // Send SMS
            sendNotificationSms(notification);
        } catch (Exception e) {
            logger.error("Failed to send SMS notification", e);
        }
    }

    /**
     * Internal method to send SMS and update status
     */
    @Transactional
    private void sendNotificationSms(Notification notification) {
        try {
            if (!smsProvider.isAvailable()) {
                logger.warn("SMS provider not available for notification {}", notification.getId());
                notificationRepository.updateFailure(notification.getId(), 
                        "SMS provider not configured");
                return;
            }

            // Send SMS
            String providerReference = smsProvider.sendSms(
                    notification.getPhoneNumber(),
                    notification.getMessage()
            );

            // Update as sent
            notificationRepository.updateStatus(notification.getId(), "SENT", providerReference);
            logger.info("SMS sent successfully. Reference: {}", providerReference);

        } catch (SmsException e) {
            handleSmsError(notification, e);
        } catch (Exception e) {
            logger.error("Unexpected error sending SMS", e);
            notificationRepository.updateFailure(notification.getId(), 
                    "Unexpected error: " + e.getMessage());
        }
    }

    /**
     * Handle SMS sending errors with retry logic
     */
    @Transactional
    private void handleSmsError(Notification notification, SmsException e) {
        logger.error("SMS sending error: {}", e.getMessage());

        if (e.isRetryable() && notification.getRetryCount() < notification.getMaxRetries()) {
            // Increment retry count
            notificationRepository.incrementRetry(notification.getId());
            logger.info("Marked notification {} for retry ({}/{})", 
                    notification.getId(), 
                    notification.getRetryCount() + 1,
                    notification.getMaxRetries());
        } else {
            // Mark as failed
            notificationRepository.updateFailure(notification.getId(), e.getMessage());
            logger.warn("Notification {} marked as failed", notification.getId());
        }
    }

    /**
     * Scheduled task: Retry failed messages every 5 minutes
     */
    @Scheduled(fixedDelay = 300000, initialDelay = 60000) // 5 minutes, wait 1 min on startup
    @Transactional
    public void retryPendingNotifications() {
        try {
            List<Notification> pending = notificationRepository.findPending();
            logger.info("Processing {} pending notifications for retry", pending.size());

            for (Notification notification : pending) {
                sendNotificationSms(notification);
            }
        } catch (Exception e) {
            logger.error("Error in retry notification task", e);
        }
    }

    /**
     * Scheduled task: Send scheduled notifications
     * Runs every minute to check for messages scheduled to send
     */
    @Scheduled(fixedDelay = 60000, initialDelay = 60000)
    @Transactional
    public void sendScheduledNotifications() {
        try {
            List<Notification> scheduled = notificationRepository.findScheduledToSend();
            logger.info("Sending {} scheduled notifications", scheduled.size());

            for (Notification notification : scheduled) {
                sendNotificationSms(notification);
            }
        } catch (Exception e) {
            logger.error("Error in scheduled notification task", e);
        }
    }

    /**
     * Get notification by ID
     */
    public Optional<Notification> getNotification(Long id) {
        return notificationRepository.findById(id);
    }

    /**
     * Get all notifications for a patient
     */
    public List<Notification> getPatientNotifications(Long patientId) {
        return notificationRepository.findByPatientId(patientId);
    }

    /**
     * Get statistics
     */
    public NotificationStats getStats() {
        return new NotificationStats(
                notificationRepository.getTotalCount(),
                notificationRepository.getSentCount(),
                notificationRepository.getFailedCount()
        );
    }

    /**
     * Statistics DTO
     */
    public static class NotificationStats {
        public Integer total;
        public Integer sent;
        public Integer failed;

        public NotificationStats(Integer total, Integer sent, Integer failed) {
            this.total = total;
            this.sent = sent;
            this.failed = failed;
        }
    }
}

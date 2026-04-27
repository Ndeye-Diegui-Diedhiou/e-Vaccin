package com.evaccin.controller;

import com.evaccin.model.Notification;
import com.evaccin.service.SmsNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * NotificationController - REST endpoints for SMS notifications
 * Manages sending, tracking, and retrieving SMS notifications
 */
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "https://evaccin.sn"})
public class NotificationController {

    @Autowired
    private SmsNotificationService smsNotificationService;

    /**
     * Send SMS to patient guardian
     * POST /api/notifications/send-sms
     */
    @PostMapping("/send-sms")
    public ResponseEntity<?> sendSms(@RequestBody SendSmsRequest request,
                                    @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            smsNotificationService.sendSms(
                    request.getPatientId(),
                    request.getPhoneNumber(),
                    request.getRecipientName(),
                    request.getMessage(),
                    request.getTemplateType() != null ? request.getTemplateType() : "CUSTOM",
                    userId
            );

            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "SMS queued for sending",
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse(false, "Failed to send SMS: " + e.getMessage(), null)
            );
        }
    }

    /**
     * Send vaccination confirmation SMS
     * POST /api/notifications/vaccination-confirmation
     */
    @PostMapping("/vaccination-confirmation")
    public ResponseEntity<?> sendVaccinationConfirmation(
            @RequestBody VaccinationSmsRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            smsNotificationService.sendVaccinationConfirmation(
                    request.getPatientId(),
                    request.getPatientName(),
                    request.getGuardianPhone(),
                    request.getGuardianName(),
                    request.getVaccineName(),
                    userId
            );

            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Vaccination confirmation SMS sent",
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse(false, "Failed to send confirmation: " + e.getMessage(), null)
            );
        }
    }

    /**
     * Send vaccination reminder SMS
     * POST /api/notifications/vaccination-reminder
     */
    @PostMapping("/vaccination-reminder")
    public ResponseEntity<?> sendVaccinationReminder(
            @RequestBody VaccinationReminderRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            smsNotificationService.sendVaccinationReminder(
                    request.getPatientId(),
                    request.getPatientName(),
                    request.getGuardianPhone(),
                    request.getGuardianName(),
                    request.getVaccineName(),
                    request.getAppointmentTime(),
                    request.getAppointmentLocation(),
                    userId
            );

            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Vaccination reminder scheduled",
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse(false, "Failed to schedule reminder: " + e.getMessage(), null)
            );
        }
    }

    /**
     * Send urgent vaccination alert
     * POST /api/notifications/alert
     */
    @PostMapping("/alert")
    public ResponseEntity<?> sendAlert(
            @RequestBody AlertRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        try {
            smsNotificationService.sendVaccinationAlert(
                    request.getPatientId(),
                    request.getPatientName(),
                    request.getGuardianPhone(),
                    request.getGuardianName(),
                    request.getReason(),
                    userId
            );

            return ResponseEntity.ok(new ApiResponse(
                    true,
                    "Alert SMS sent",
                    null
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse(false, "Failed to send alert: " + e.getMessage(), null)
            );
        }
    }

    /**
     * Get notification by ID
     * GET /api/notifications/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getNotification(@PathVariable Long id) {
        try {
            Optional<Notification> notification = smsNotificationService.getNotification(id);

            if (notification.isPresent()) {
                return ResponseEntity.ok(new ApiResponse(true, "Notification found", notification.get()));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ApiResponse(false, "Notification not found", null)
                );
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse(false, "Error retrieving notification: " + e.getMessage(), null)
            );
        }
    }

    /**
     * Get all notifications for a patient
     * GET /api/notifications/patient/{patientId}
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientNotifications(@PathVariable Long patientId) {
        try {
            List<Notification> notifications = smsNotificationService.getPatientNotifications(patientId);
            return ResponseEntity.ok(new ApiResponse(true, "Notifications retrieved", notifications));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse(false, "Error retrieving notifications: " + e.getMessage(), null)
            );
        }
    }

    /**
     * Get notification statistics
     * GET /api/notifications/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            SmsNotificationService.NotificationStats stats = smsNotificationService.getStats();
            return ResponseEntity.ok(new ApiResponse(true, "Statistics retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ApiResponse(false, "Error retrieving statistics: " + e.getMessage(), null)
            );
        }
    }

    // ========== Request DTOs ==========

    public static class SendSmsRequest {
        private Long patientId;
        private String phoneNumber;
        private String recipientName;
        private String message;
        private String templateType;

        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

        public String getRecipientName() { return recipientName; }
        public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getTemplateType() { return templateType; }
        public void setTemplateType(String templateType) { this.templateType = templateType; }
    }

    public static class VaccinationSmsRequest {
        private Long patientId;
        private String patientName;
        private String guardianPhone;
        private String guardianName;
        private String vaccineName;

        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getGuardianPhone() { return guardianPhone; }
        public void setGuardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; }

        public String getGuardianName() { return guardianName; }
        public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

        public String getVaccineName() { return vaccineName; }
        public void setVaccineName(String vaccineName) { this.vaccineName = vaccineName; }
    }

    public static class VaccinationReminderRequest extends VaccinationSmsRequest {
        private java.time.LocalDateTime appointmentTime;
        private String appointmentLocation;

        public java.time.LocalDateTime getAppointmentTime() { return appointmentTime; }
        public void setAppointmentTime(java.time.LocalDateTime appointmentTime) { 
            this.appointmentTime = appointmentTime; 
        }

        public String getAppointmentLocation() { return appointmentLocation; }
        public void setAppointmentLocation(String appointmentLocation) { 
            this.appointmentLocation = appointmentLocation; 
        }
    }

    public static class AlertRequest {
        private Long patientId;
        private String patientName;
        private String guardianPhone;
        private String guardianName;
        private String reason;

        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }

        public String getPatientName() { return patientName; }
        public void setPatientName(String patientName) { this.patientName = patientName; }

        public String getGuardianPhone() { return guardianPhone; }
        public void setGuardianPhone(String guardianPhone) { this.guardianPhone = guardianPhone; }

        public String getGuardianName() { return guardianName; }
        public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }

    // ========== Response DTO ==========

    public static class ApiResponse {
        private Boolean success;
        private String message;
        private Object data;

        public ApiResponse(Boolean success, String message, Object data) {
            this.success = success;
            this.message = message;
            this.data = data;
        }

        public Boolean getSuccess() { return success; }
        public String getMessage() { return message; }
        public Object getData() { return data; }
    }
}

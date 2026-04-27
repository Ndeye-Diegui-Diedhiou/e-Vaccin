-- =====================================================
-- SMS Notifications Table Schema
-- =====================================================

-- Create notifications table for SMS tracking
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    user_id BIGINT,
    phone_number VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    template_type VARCHAR(50) NOT NULL COMMENT 'VACCINATION_CONFIRMATION, VACCINATION_REMINDER, ALERT, CUSTOM',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING' COMMENT 'PENDING, SENT, DELIVERED, FAILED, RETRYING',
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    provider_reference VARCHAR(255) COMMENT 'SMS provider message ID (e.g., Twilio SID)',
    failure_reason TEXT,
    scheduled_time DATETIME COMMENT 'Time to send scheduled messages',
    sent_time DATETIME COMMENT 'Actual time message was sent',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_notification_patient FOREIGN KEY (patient_id) 
        REFERENCES patients(id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL,

    -- Indexes for performance
    INDEX idx_patient_id (patient_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_scheduled_time (scheduled_time),
    INDEX idx_template_type (template_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Update users table if it doesn't have phone_number
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Update patients table if it doesn't have phone_number for guardian
ALTER TABLE patients ADD COLUMN IF NOT EXISTS guardian_phone VARCHAR(20);

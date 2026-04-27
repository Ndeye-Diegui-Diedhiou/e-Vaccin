package com.evaccin.repository;

import com.evaccin.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * NotificationRepository - JDBC Implementation
 * Manages SMS notifications persistence without ORM
 */
@Repository
public class NotificationRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Notification> notificationRowMapper = this::mapRow;

    /**
     * Save a new notification
     */
    public Notification save(Notification notification) {
        String sql = "INSERT INTO notifications (patient_id, user_id, phone_number, recipient_name, " +
                     "message, template_type, status, retry_count, max_retries, scheduled_time, created_at, updated_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try {
            int result = jdbcTemplate.update(sql,
                    notification.getPatientId(),
                    notification.getUserId(),
                    notification.getPhoneNumber(),
                    notification.getRecipientName(),
                    notification.getMessage(),
                    notification.getTemplateType(),
                    notification.getStatus(),
                    0,
                    notification.getMaxRetries(),
                    notification.getScheduledTime() != null ? Timestamp.valueOf(notification.getScheduledTime()) : null,
                    Timestamp.valueOf(LocalDateTime.now()),
                    Timestamp.valueOf(LocalDateTime.now())
            );

            if (result > 0) {
                // Retrieve the generated ID
                Long id = jdbcTemplate.queryForObject(
                        "SELECT LAST_INSERT_ID()",
                        Long.class
                );
                notification.setId(id);
            }
            return notification;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save notification: " + e.getMessage(), e);
        }
    }

    /**
     * Find notification by ID
     */
    public Optional<Notification> findById(Long id) {
        String sql = "SELECT * FROM notifications WHERE id = ?";
        try {
            Notification notification = jdbcTemplate.queryForObject(sql, notificationRowMapper, id);
            return Optional.ofNullable(notification);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Find all notifications for a patient
     */
    public List<Notification> findByPatientId(Long patientId) {
        String sql = "SELECT * FROM notifications WHERE patient_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper, patientId);
    }

    /**
     * Find pending notifications (for retry logic)
     */
    public List<Notification> findPending() {
        String sql = "SELECT * FROM notifications WHERE status IN ('PENDING', 'RETRYING') " +
                     "AND retry_count < max_retries " +
                     "ORDER BY created_at ASC LIMIT 100";
        return jdbcTemplate.query(sql, notificationRowMapper);
    }

    /**
     * Find failed notifications
     */
    public List<Notification> findFailed() {
        String sql = "SELECT * FROM notifications WHERE status = 'FAILED' " +
                     "AND retry_count >= max_retries " +
                     "ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper);
    }

    /**
     * Find scheduled notifications ready to send
     */
    public List<Notification> findScheduledToSend() {
        String sql = "SELECT * FROM notifications WHERE status = 'PENDING' " +
                     "AND scheduled_time IS NOT NULL AND scheduled_time <= NOW() " +
                     "ORDER BY scheduled_time ASC";
        return jdbcTemplate.query(sql, notificationRowMapper);
    }

    /**
     * Update notification status after sending
     */
    public void updateStatus(Long id, String status, String providerReference) {
        String sql = "UPDATE notifications SET status = ?, provider_reference = ?, " +
                     "sent_time = ?, updated_at = ? WHERE id = ?";
        
        jdbcTemplate.update(sql,
                status,
                providerReference,
                Timestamp.valueOf(LocalDateTime.now()),
                Timestamp.valueOf(LocalDateTime.now()),
                id
        );
    }

    /**
     * Update status with failure reason
     */
    public void updateFailure(Long id, String failureReason) {
        String sql = "UPDATE notifications SET status = 'FAILED', failure_reason = ?, " +
                     "updated_at = ? WHERE id = ?";
        
        jdbcTemplate.update(sql,
                failureReason,
                Timestamp.valueOf(LocalDateTime.now()),
                id
        );
    }

    /**
     * Increment retry count
     */
    public void incrementRetry(Long id) {
        String sql = "UPDATE notifications SET retry_count = retry_count + 1, " +
                     "status = 'RETRYING', updated_at = ? WHERE id = ?";
        
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }

    /**
     * Get all notifications with pagination
     */
    public List<Notification> findAll(int page, int size) {
        int offset = (page - 1) * size;
        String sql = "SELECT * FROM notifications ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, notificationRowMapper, size, offset);
    }

    /**
     * Get statistics
     */
    public Integer getTotalCount() {
        String sql = "SELECT COUNT(*) FROM notifications";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    public Integer getSentCount() {
        String sql = "SELECT COUNT(*) FROM notifications WHERE status = 'SENT'";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    public Integer getFailedCount() {
        String sql = "SELECT COUNT(*) FROM notifications WHERE status = 'FAILED'";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * RowMapper - Convert ResultSet to Notification object
     */
    private Notification mapRow(ResultSet rs, int rowNum) throws SQLException {
        Notification notification = new Notification();
        notification.setId(rs.getLong("id"));
        notification.setPatientId(rs.getLong("patient_id"));
        notification.setUserId(rs.getLong("user_id"));
        notification.setPhoneNumber(rs.getString("phone_number"));
        notification.setRecipientName(rs.getString("recipient_name"));
        notification.setMessage(rs.getString("message"));
        notification.setTemplateType(rs.getString("template_type"));
        notification.setStatus(rs.getString("status"));
        notification.setRetryCount(rs.getInt("retry_count"));
        notification.setMaxRetries(rs.getInt("max_retries"));
        notification.setProviderReference(rs.getString("provider_reference"));
        notification.setFailureReason(rs.getString("failure_reason"));

        Timestamp scheduledTs = rs.getTimestamp("scheduled_time");
        if (scheduledTs != null) {
            notification.setScheduledTime(scheduledTs.toLocalDateTime());
        }

        Timestamp sentTs = rs.getTimestamp("sent_time");
        if (sentTs != null) {
            notification.setSentTime(sentTs.toLocalDateTime());
        }

        Timestamp createdTs = rs.getTimestamp("created_at");
        if (createdTs != null) {
            notification.setCreatedAt(createdTs.toLocalDateTime());
        }

        Timestamp updatedTs = rs.getTimestamp("updated_at");
        if (updatedTs != null) {
            notification.setUpdatedAt(updatedTs.toLocalDateTime());
        }

        return notification;
    }
}

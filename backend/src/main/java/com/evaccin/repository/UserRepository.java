package com.evaccin.repository;

import com.evaccin.model.User;
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
 * UserRepository - JDBC Implementation
 * Manages user data access without ORM
 */
@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<User> userRowMapper = this::mapRow;

    /**
     * Save a new user
     */
    public User save(User user) {
        String sql = "INSERT INTO users (email, password, first_name, last_name, role, phone_number, " +
                     "is_active, created_at, updated_at) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            int result = jdbcTemplate.update(sql,
                    user.getEmail(),
                    user.getPassword(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getRole(),
                    user.getPhoneNumber(),
                    user.getIsActive() != null ? user.getIsActive() : true,
                    Timestamp.valueOf(LocalDateTime.now()),
                    Timestamp.valueOf(LocalDateTime.now())
            );

            if (result > 0) {
                Long id = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
                user.setId(id);
            }
            return user;
        } catch (Exception e) {
            throw new RuntimeException("Failed to save user: " + e.getMessage(), e);
        }
    }

    /**
     * Find user by ID
     */
    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try {
            User user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /**
     * Check if email already exists
     */
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    /**
     * Find all active users
     */
    public List<User> findAllActive() {
        String sql = "SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    /**
     * Find users by role
     */
    public List<User> findByRole(String role) {
        String sql = "SELECT * FROM users WHERE role = ? AND is_active = true ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, userRowMapper, role);
    }

    /**
     * Update user
     */
    public void update(User user) {
        String sql = "UPDATE users SET first_name = ?, last_name = ?, email = ?, " +
                     "role = ?, phone_number = ?, is_active = ?, updated_at = ? " +
                     "WHERE id = ?";

        jdbcTemplate.update(sql,
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole(),
                user.getPhoneNumber(),
                user.getIsActive(),
                Timestamp.valueOf(LocalDateTime.now()),
                user.getId()
        );
    }

    /**
     * Update password
     */
    public void updatePassword(Long userId, String newPassword) {
        String sql = "UPDATE users SET password = ?, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, newPassword, Timestamp.valueOf(LocalDateTime.now()), userId);
    }

    /**
     * Deactivate user
     */
    public void deactivate(Long id) {
        String sql = "UPDATE users SET is_active = false, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }

    /**
     * Activate user
     */
    public void activate(Long id) {
        String sql = "UPDATE users SET is_active = true, updated_at = ? WHERE id = ?";
        jdbcTemplate.update(sql, Timestamp.valueOf(LocalDateTime.now()), id);
    }

    /**
     * Get total user count
     */
    public Integer getTotalCount() {
        String sql = "SELECT COUNT(*) FROM users";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

    /**
     * Get count by role
     */
    public Integer getCountByRole(String role) {
        String sql = "SELECT COUNT(*) FROM users WHERE role = ?";
        return jdbcTemplate.queryForObject(sql, Integer.class, role);
    }

    /**
     * Get all users with pagination
     */
    public List<User> findAll(int page, int size) {
        int offset = (page - 1) * size;
        String sql = "SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?";
        return jdbcTemplate.query(sql, userRowMapper, size, offset);
    }

    /**
     * RowMapper - Convert ResultSet to User object
     */
    private User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setFirstName(rs.getString("first_name"));
        user.setLastName(rs.getString("last_name"));
        user.setRole(rs.getString("role"));
        user.setPhoneNumber(rs.getString("phone_number"));
        user.setIsActive(rs.getBoolean("is_active"));

        Timestamp createdTs = rs.getTimestamp("created_at");
        if (createdTs != null) {
            user.setCreatedAt(createdTs.toLocalDateTime());
        }

        Timestamp updatedTs = rs.getTimestamp("updated_at");
        if (updatedTs != null) {
            user.setUpdatedAt(updatedTs.toLocalDateTime());
        }

        return user;
    }
}

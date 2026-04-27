package com.evaccin.service;

import com.evaccin.model.User;
import com.evaccin.repository.UserRepository;
import com.evaccin.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * AuthService - Authentication and authorization service
 * Handles user login, registration, token generation, and password management
 */
@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Login user with email and password
     * @param email User email
     * @param password User password (plain)
     * @return AuthResponse with tokens and user info
     * @throws AuthenticationException if credentials invalid
     */
    @Transactional(readOnly = true)
    public AuthResponse login(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.warn("Login failed: user not found for email: {}", email);
                    return new AuthenticationException("Invalid email or password");
                });

        // Check if user is active
        if (!user.getIsActive()) {
            logger.warn("Login failed: user account deactivated: {}", email);
            throw new AuthenticationException("User account is deactivated");
        }

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            logger.warn("Login failed: invalid password for user: {}", email);
            throw new AuthenticationException("Invalid email or password");
        }

        // Generate tokens
        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getRole()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(
                user.getId(),
                user.getEmail()
        );

        logger.info("User logged in successfully: {}", email);

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                jwtTokenProvider.getTokenExpirationTime(accessToken),
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getFirstName() + " " + user.getLastName()
        );
    }

    /**
     * Register new user
     * @param email User email
     * @param password User password (plain)
     * @param firstName User first name
     * @param lastName User last name
     * @param role User role (ADMIN, MEDECIN, AGENT)
     * @return User object
     * @throws AuthenticationException if email already exists
     */
    @Transactional
    public User register(String email, String password, String firstName, String lastName, String role) {
        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            logger.warn("Registration failed: email already exists: {}", email);
            throw new AuthenticationException("Email already registered");
        }

        // Validate role
        if (!isValidRole(role)) {
            throw new AuthenticationException("Invalid role: " + role);
        }

        // Create new user
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setIsActive(true);

        user = userRepository.save(user);

        logger.info("New user registered: {} with role: {}", email, role);

        return user;
    }

    /**
     * Refresh access token using refresh token
     */
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        try {
            // Validate refresh token
            jwtTokenProvider.validateToken(refreshToken);

            // Extract user info from token
            Long userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
            String email = jwtTokenProvider.getEmailFromToken(refreshToken);

            // Get user from database
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AuthenticationException("User not found"));

            if (!user.getIsActive()) {
                throw new AuthenticationException("User account is deactivated");
            }

            // Generate new access token
            String newAccessToken = jwtTokenProvider.generateAccessToken(
                    user.getId(),
                    user.getEmail(),
                    user.getRole()
            );

            logger.info("Token refreshed for user: {}", email);

            return new AuthResponse(
                    newAccessToken,
                    refreshToken,
                    "Bearer",
                    jwtTokenProvider.getTokenExpirationTime(newAccessToken),
                    user.getId(),
                    user.getEmail(),
                    user.getRole(),
                    user.getFirstName() + " " + user.getLastName()
            );
        } catch (Exception e) {
            logger.warn("Token refresh failed: {}", e.getMessage());
            throw new AuthenticationException("Invalid refresh token");
        }
    }

    /**
     * Change user password
     */
    @Transactional
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            logger.warn("Password change failed: incorrect current password for user: {}", user.getEmail());
            throw new AuthenticationException("Current password is incorrect");
        }

        // Update password
        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(userId, encodedPassword);

        logger.info("Password changed for user: {}", user.getEmail());
    }

    /**
     * Reset password (admin function)
     */
    @Transactional
    public void resetPassword(Long userId, String newPassword, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("User not found"));

        // Verify admin has permission (can be enhanced with role check)
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new AuthenticationException("Admin not found"));

        if (!"ADMIN".equals(admin.getRole())) {
            logger.warn("Unauthorized password reset attempt by user: {}", admin.getEmail());
            throw new AuthenticationException("Only admins can reset passwords");
        }

        // Update password
        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(userId, encodedPassword);

        logger.info("Password reset for user {} by admin {}", user.getEmail(), admin.getEmail());
    }

    /**
     * Validate role
     */
    private boolean isValidRole(String role) {
        return "ADMIN".equals(role) || "MEDECIN".equals(role) || "AGENT".equals(role);
    }

    /**
     * Get user by ID
     */
    @Transactional(readOnly = true)
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("User not found"));
    }

    /**
     * Check if user has role
     */
    @Transactional(readOnly = true)
    public boolean hasRole(Long userId, String requiredRole) {
        return userRepository.findById(userId)
                .map(user -> requiredRole.equals(user.getRole()))
                .orElse(false);
    }

    // ========== Response DTOs ==========

    public static class AuthResponse {
        public String accessToken;
        public String refreshToken;
        public String tokenType;
        public Long expiresIn;
        public Long userId;
        public String email;
        public String role;
        public String fullName;

        public AuthResponse(String accessToken, String refreshToken, String tokenType,
                           Long expiresIn, Long userId, String email, String role, String fullName) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
            this.tokenType = tokenType;
            this.expiresIn = expiresIn;
            this.userId = userId;
            this.email = email;
            this.role = role;
            this.fullName = fullName;
        }

        // Getters for Spring response serialization
        public String getAccessToken() { return accessToken; }
        public String getRefreshToken() { return refreshToken; }
        public String getTokenType() { return tokenType; }
        public Long getExpiresIn() { return expiresIn; }
        public Long getUserId() { return userId; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getFullName() { return fullName; }
    }

    public static class AuthenticationException extends RuntimeException {
        public AuthenticationException(String message) {
            super(message);
        }
    }
}

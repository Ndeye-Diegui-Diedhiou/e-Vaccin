package com.evaccin.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JwtTokenProvider - JWT token generation and validation
 * Handles JWT token lifecycle for authentication
 * 
 * Configuration in application.properties:
 * - app.jwt.secret=your-super-secret-key-min-32-chars
 * - app.jwt.expiration=86400000 (24 hours in milliseconds)
 * - app.jwt.refresh-expiration=604800000 (7 days in milliseconds)
 */
@Component
public class JwtTokenProvider {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpirationInMs;

    @Value("${app.jwt.refresh-expiration:604800000}")
    private long refreshTokenExpirationInMs;

    /**
     * Generate JWT access token
     */
    public String generateAccessToken(Long userId, String email, String role) {
        return generateToken(userId, email, role, jwtExpirationInMs);
    }

    /**
     * Generate JWT refresh token
     */
    public String generateRefreshToken(Long userId, String email) {
        return generateToken(userId, email, "REFRESH", refreshTokenExpirationInMs);
    }

    /**
     * Internal token generation
     */
    private String generateToken(Long userId, String email, String role, long expirationMs) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Get user ID from token
     */
    public Long getUserIdFromToken(String token) {
        return Long.parseLong(extractAllClaims(token).getSubject());
    }

    /**
     * Get email from token
     */
    public String getEmailFromToken(String token) {
        return (String) extractAllClaims(token).get("email");
    }

    /**
     * Get role from token
     */
    public String getRoleFromToken(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    /**
     * Validate JWT token
     */
    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            throw new JwtAuthenticationException("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            throw new JwtAuthenticationException("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            throw new JwtAuthenticationException("Expired JWT token: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            throw new JwtAuthenticationException("Unsupported JWT token: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            throw new JwtAuthenticationException("JWT claims string is empty: " + e.getMessage());
        }
    }

    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    /**
     * Extract all claims from token
     */
    private Claims extractAllClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Get token expiration time
     */
    public long getTokenExpirationTime(String token) {
        Claims claims = extractAllClaims(token);
        return claims.getExpiration().getTime();
    }
}

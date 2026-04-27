# 🚀 Backend Spring Boot - Architecture SANS ORM

## 📋 Stack Backend (Sans ORM)

```
Spring Boot (Java)
    ├── REST API Endpoints
    ├── JdbcTemplate (accès DB direct)
    ├── Service Layer
    ├── Repository Pattern
    └── Exception Handling

MySQL Database
    ├── Tables
    ├── Relationships
    └── Stored Procedures

SMS API Gateway
    └── Notification Service
```

---

## 📁 Structure Projet Spring Boot

```
e-vaccin-backend/
├── src/main/java/com/evaccin/
│   ├── controller/          # REST Endpoints
│   │   ├── AuthController.java
│   │   ├── PatientController.java
│   │   ├── VaccinationController.java
│   │   └── ReportController.java
│   ├── service/             # Business Logic
│   │   ├── AuthService.java
│   │   ├── PatientService.java
│   │   ├── VaccinationService.java
│   │   └── NotificationService.java
│   ├── repository/          # Data Access (JDBC)
│   │   ├── PatientRepository.java
│   │   ├── VaccinationRepository.java
│   │   └── UserRepository.java
│   ├── model/               # POJOs
│   │   ├── User.java
│   │   ├── Patient.java
│   │   ├── Vaccination.java
│   │   └── ApiResponse.java
│   ├── exception/           # Custom Exceptions
│   │   ├── ApiException.java
│   │   └── GlobalExceptionHandler.java
│   ├── config/              # Configuration
│   │   ├── SecurityConfig.java
│   │   ├── JdbcConfig.java
│   │   └── CorsConfig.java
│   ├── util/                # Utilities
│   │   ├── JwtUtil.java
│   │   └── ValidationUtil.java
│   └── EvaccinApplication.java  # Main Class
├── src/main/resources/
│   ├── application.properties
│   ├── application-prod.properties
│   └── db/
│       └── schema.sql
├── pom.xml
└── README.md
```

---

## 🔧 pom.xml Dependencies

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.evaccin</groupId>
    <artifactId>evaccin-backend</artifactId>
    <version>2.0.0</version>
    <packaging>jar</packaging>

    <name>e-Vaccin Backend</name>
    <description>Plateforme de vaccination - Backend</description>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.0.0</version>
    </parent>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring JDBC (NO ORM) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>

        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>

        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Lombok (Optional - reduces boilerplate) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Testing -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 📝 application.properties

```properties
# Application
spring.application.name=e-vaccin-backend
server.port=8080
server.servlet.context-path=/api

# Environment
spring.profiles.active=dev

# MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/evaccin_db
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# JPA (disabled since we use JDBC)
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=none

# Logging
logging.level.root=INFO
logging.level.com.evaccin=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n

# Security
app.jwt.secret=your-super-secret-key-change-in-production-12345
app.jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:3000,https://evaccin.sn

# File Upload
app.upload.dir=/uploads
app.upload.max-size=10485760

# SMS Configuration
app.sms.api-key=YOUR_SMS_API_KEY
app.sms.sender-id=EVACCIN
```

---

## 🗄️ Database Schema (schema.sql)

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS evaccin_db;
USE evaccin_db;

-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('ADMIN', 'MEDECIN', 'AGENT') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patients table
CREATE TABLE patients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cni VARCHAR(13) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender ENUM('M', 'F') NOT NULL,
    phone VARCHAR(20),
    guardian_name VARCHAR(100),
    address TEXT,
    district VARCHAR(50),
    region VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Vaccines table
CREATE TABLE vaccines (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    recommended_age INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Vaccinations table
CREATE TABLE vaccinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    vaccine_id BIGINT NOT NULL,
    vaccination_date DATE NOT NULL,
    lot_number VARCHAR(50),
    injection_site VARCHAR(50),
    administered_by BIGINT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id),
    FOREIGN KEY (administered_by) REFERENCES users(id),
    INDEX idx_patient_id (patient_id),
    INDEX idx_vaccination_date (vaccination_date)
);

-- Vaccination Schedule table
CREATE TABLE vaccination_schedule (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    vaccine_id BIGINT NOT NULL,
    scheduled_date DATE,
    status ENUM('PENDING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccines(id),
    UNIQUE KEY unique_schedule (patient_id, vaccine_id)
);

-- Certificates table
CREATE TABLE certificates (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    certificate_number VARCHAR(50) UNIQUE,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE,
    is_valid BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Audit log
CREATE TABLE audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100),
    entity_type VARCHAR(50),
    entity_id BIGINT,
    changes JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_created_at (created_at)
);

-- Indexes for performance
CREATE INDEX idx_patients_district ON patients(district);
CREATE INDEX idx_patients_region ON patients(region);
CREATE INDEX idx_vaccinations_patient ON vaccinations(patient_id);
CREATE INDEX idx_vaccinations_date ON vaccinations(vaccination_date);
```

---

## 🏗️ Model Classes

### User.java
```java
package com.evaccin.model;

import java.time.LocalDateTime;

public class User {
    private Long id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private UserRole role;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public User() {}

    public User(String email, String password, String firstName, 
                String lastName, UserRole role) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.isActive = true;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", role=" + role +
                ", isActive=" + isActive +
                '}';
    }
}

enum UserRole {
    ADMIN, MEDECIN, AGENT
}
```

### Patient.java
```java
package com.evaccin.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Patient {
    private Long id;
    private String cni;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String gender;
    private String phone;
    private String guardianName;
    private String address;
    private String district;
    private String region;
    private Boolean isActive;
    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors, Getters, Setters...
    public Patient() {}

    public Patient(String cni, String firstName, String lastName, 
                   LocalDate birthDate, String gender, String district, String region) {
        this.cni = cni;
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDate = birthDate;
        this.gender = gender;
        this.district = district;
        this.region = region;
        this.isActive = true;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCni() { return cni; }
    public void setCni(String cni) { this.cni = cni; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGuardianName() { return guardianName; }
    public void setGuardianName(String guardianName) { this.guardianName = guardianName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
```

---

## 📦 Repository Layer (JDBC)

### PatientRepository.java
```java
package com.evaccin.repository;

import com.evaccin.model.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class PatientRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper for Patient
    private Patient mapRow(ResultSet rs, int rowNum) throws Exception {
        Patient patient = new Patient();
        patient.setId(rs.getLong("id"));
        patient.setCni(rs.getString("cni"));
        patient.setFirstName(rs.getString("first_name"));
        patient.setLastName(rs.getString("last_name"));
        patient.setBirthDate(rs.getDate("birth_date").toLocalDate());
        patient.setGender(rs.getString("gender"));
        patient.setPhone(rs.getString("phone"));
        patient.setGuardianName(rs.getString("guardian_name"));
        patient.setAddress(rs.getString("address"));
        patient.setDistrict(rs.getString("district"));
        patient.setRegion(rs.getString("region"));
        patient.setIsActive(rs.getBoolean("is_active"));
        patient.setCreatedBy(rs.getLong("created_by"));
        patient.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        patient.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return patient;
    }

    // Create
    public Long save(Patient patient, Long userId) {
        String sql = """
            INSERT INTO patients (cni, first_name, last_name, birth_date, gender,
                                  phone, guardian_name, address, district, region,
                                  created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection con) throws Exception {
                PreparedStatement ps = con.prepareStatement(sql, 
                    Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, patient.getCni());
                ps.setString(2, patient.getFirstName());
                ps.setString(3, patient.getLastName());
                ps.setDate(4, java.sql.Date.valueOf(patient.getBirthDate()));
                ps.setString(5, patient.getGender());
                ps.setString(6, patient.getPhone());
                ps.setString(7, patient.getGuardianName());
                ps.setString(8, patient.getAddress());
                ps.setString(9, patient.getDistrict());
                ps.setString(10, patient.getRegion());
                ps.setLong(11, userId);
                return ps;
            }
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    // Read
    public Optional<Patient> findById(Long id) {
        String sql = "SELECT * FROM patients WHERE id = ? AND is_active = TRUE";
        List<Patient> patients = jdbcTemplate.query(sql, 
            new Object[]{id}, 
            (rs, rowNum) -> mapRow(rs, rowNum));
        return patients.stream().findFirst();
    }

    public Optional<Patient> findByCni(String cni) {
        String sql = "SELECT * FROM patients WHERE cni = ? AND is_active = TRUE";
        List<Patient> patients = jdbcTemplate.query(sql, 
            new Object[]{cni}, 
            (rs, rowNum) -> mapRow(rs, rowNum));
        return patients.stream().findFirst();
    }

    public List<Patient> findAll(int page, int size) {
        int offset = (page - 1) * size;
        String sql = """
            SELECT * FROM patients 
            WHERE is_active = TRUE
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
            """;
        return jdbcTemplate.query(sql, 
            new Object[]{size, offset}, 
            (rs, rowNum) -> mapRow(rs, rowNum));
    }

    public List<Patient> findByDistrict(String district) {
        String sql = """
            SELECT * FROM patients 
            WHERE district = ? AND is_active = TRUE
            ORDER BY created_at DESC
            """;
        return jdbcTemplate.query(sql, 
            new Object[]{district}, 
            (rs, rowNum) -> mapRow(rs, rowNum));
    }

    public List<Patient> search(String searchTerm) {
        String sql = """
            SELECT * FROM patients 
            WHERE (first_name LIKE ? OR last_name LIKE ? OR cni LIKE ?)
            AND is_active = TRUE
            ORDER BY created_at DESC
            """;
        String term = "%" + searchTerm + "%";
        return jdbcTemplate.query(sql, 
            new Object[]{term, term, term}, 
            (rs, rowNum) -> mapRow(rs, rowNum));
    }

    // Update
    public void update(Patient patient) {
        String sql = """
            UPDATE patients SET first_name = ?, last_name = ?, phone = ?,
                               guardian_name = ?, address = ?
            WHERE id = ?
            """;
        jdbcTemplate.update(sql,
            patient.getFirstName(),
            patient.getLastName(),
            patient.getPhone(),
            patient.getGuardianName(),
            patient.getAddress(),
            patient.getId());
    }

    // Delete (Soft delete)
    public void deactivate(Long id) {
        String sql = "UPDATE patients SET is_active = FALSE WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    // Count
    public Long count() {
        String sql = "SELECT COUNT(*) FROM patients WHERE is_active = TRUE";
        return jdbcTemplate.queryForObject(sql, Long.class);
    }
}
```

---

## 🎯 Service Layer

### PatientService.java
```java
package com.evaccin.service;

import com.evaccin.exception.ApiException;
import com.evaccin.model.Patient;
import com.evaccin.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AuditService auditService;

    @Transactional
    public Long createPatient(Patient patient, Long userId) {
        // Validation
        Optional<Patient> existing = patientRepository.findByCni(patient.getCni());
        if (existing.isPresent()) {
            throw new ApiException("Patient avec CNI " + patient.getCni() + 
                                 " existe déjà", HttpStatus.CONFLICT);
        }

        // Save
        Long patientId = patientRepository.save(patient, userId);

        // Audit
        auditService.log(userId, "CREATE", "PATIENT", patientId);

        return patientId;
    }

    @Transactional(readOnly = true)
    public Patient getPatient(Long id) {
        return patientRepository.findById(id)
            .orElseThrow(() -> new ApiException(
                "Patient avec ID " + id + " non trouvé",
                HttpStatus.NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public Optional<Patient> getPatientByCni(String cni) {
        return patientRepository.findByCni(cni);
    }

    @Transactional(readOnly = true)
    public List<Patient> getAllPatients(int page, int size) {
        if (page < 1 || size < 1) {
            throw new ApiException("Page et size invalides", 
                                 HttpStatus.BAD_REQUEST);
        }
        return patientRepository.findAll(page, size);
    }

    @Transactional(readOnly = true)
    public List<Patient> searchPatients(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new ApiException("Terme de recherche requis", 
                                 HttpStatus.BAD_REQUEST);
        }
        return patientRepository.search(searchTerm.trim());
    }

    @Transactional
    public void updatePatient(Long id, Patient patient, Long userId) {
        Patient existing = getPatient(id);
        existing.setFirstName(patient.getFirstName());
        existing.setLastName(patient.getLastName());
        existing.setPhone(patient.getPhone());
        existing.setGuardianName(patient.getGuardianName());
        existing.setAddress(patient.getAddress());

        patientRepository.update(existing);
        auditService.log(userId, "UPDATE", "PATIENT", id);
    }

    @Transactional
    public void deletePatient(Long id, Long userId) {
        getPatient(id); // Verify exists
        patientRepository.deactivate(id);
        auditService.log(userId, "DELETE", "PATIENT", id);
    }

    @Transactional(readOnly = true)
    public Long getTotalPatients() {
        return patientRepository.count();
    }
}
```

---

## 🎮 Controller Layer

### PatientController.java
```java
package com.evaccin.controller;

import com.evaccin.model.ApiResponse;
import com.evaccin.model.Patient;
import com.evaccin.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> createPatient(
            @RequestBody Patient patient,
            @RequestHeader("X-User-Id") Long userId) {
        Long patientId = patientService.createPatient(patient, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(
                "Patient créé avec succès",
                patientId,
                HttpStatus.CREATED));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Patient>> getPatient(@PathVariable Long id) {
        Patient patient = patientService.getPatient(id);
        return ResponseEntity.ok(new ApiResponse<>(
            "Patient récupéré",
            patient,
            HttpStatus.OK));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Patient>>> getAllPatients(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Patient> patients = patientService.getAllPatients(page, size);
        return ResponseEntity.ok(new ApiResponse<>(
            "Patients récupérés",
            patients,
            HttpStatus.OK));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Patient>>> searchPatients(
            @RequestParam String q) {
        List<Patient> results = patientService.searchPatients(q);
        return ResponseEntity.ok(new ApiResponse<>(
            "Résultats de recherche",
            results,
            HttpStatus.OK));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient patient,
            @RequestHeader("X-User-Id") Long userId) {
        patientService.updatePatient(id, patient, userId);
        return ResponseEntity.ok(new ApiResponse<>(
            "Patient mis à jour",
            null,
            HttpStatus.OK));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId) {
        patientService.deletePatient(id, userId);
        return ResponseEntity.ok(new ApiResponse<>(
            "Patient supprimé",
            null,
            HttpStatus.OK));
    }
}
```

---

## ✅ Points Clés

1. **Pas d'ORM** = JDBC direct + JdbcTemplate
2. **CRUD complet** avec gestion d'erreurs
3. **Auditing** des modifications
4. **Validation** des données
5. **Transactions** correctement gérées
6. **REST API** complète
7. **Pagination** & recherche
8. **Performance** optimisée (index DB)

---

Continuons avec **Authentication**, **Vaccination Controller**, et **SMS Integration**? 🚀

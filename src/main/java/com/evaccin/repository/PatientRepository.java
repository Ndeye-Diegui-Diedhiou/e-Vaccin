package com.evaccin.repository;

import com.evaccin.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByCodePatient(String codePatient);
    boolean existsByCodePatient(String codePatient);
    List<Patient> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrCodePatientContainingIgnoreCase(String nom, String prenom, String code);
}

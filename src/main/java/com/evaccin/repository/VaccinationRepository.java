package com.evaccin.repository;

import com.evaccin.model.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {
    List<Vaccination> findByPatientIdOrderByDatePrevueAsc(Long patientId);
    long countByStatut(String statut);

    // Pour l'Espace Parent
    List<Vaccination> findByPatientCodePatientAndPatientTelephoneParentOrderByDatePrevueAsc(String codePatient, String telephoneParent);

    // Pour le Dashboard Agent
    List<Vaccination> findByDatePrevueOrderByPatientNomAsc(java.time.LocalDate datePrevue);
}

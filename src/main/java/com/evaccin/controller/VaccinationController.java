package com.evaccin.controller;

import com.evaccin.model.Vaccination;
import com.evaccin.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/vaccinations")
public class VaccinationController {

    @Autowired
    private VaccinationRepository vaccinationRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        return ResponseEntity.ok(Map.of("success", true, "data", vaccinationRepository.findAll()));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Map<String, Object>> getByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(Map.of("success", true, "data",
                vaccinationRepository.findByPatientIdOrderByDatePrevueAsc(patientId)));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Vaccination vaccination) {
        if (vaccination.getStatut() == null) vaccination.setStatut("FAIT");
        Vaccination saved = vaccinationRepository.save(vaccination);
        return ResponseEntity.ok(Map.of("success", true, "data", saved));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "total", vaccinationRepository.count(),
                        "fait", vaccinationRepository.countByStatut("FAIT"),
                        "retard", vaccinationRepository.countByStatut("EN_RETARD")
                )
        ));
    }

    @GetMapping("/carnet")
    public ResponseEntity<Map<String, Object>> getCarnetParent(
            @RequestParam String codePatient,
            @RequestParam String telephoneParent) {
        
        var vaccinations = vaccinationRepository
                .findByPatientCodePatientAndPatientTelephoneParentOrderByDatePrevueAsc(codePatient, telephoneParent);
                
        if (vaccinations.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Patient non trouvé ou numéro incorrect"));
        }
        
        return ResponseEntity.ok(Map.of("success", true, "data", vaccinations, "patient", vaccinations.get(0).getPatient()));
    }

    @GetMapping("/planning/jour")
    public ResponseEntity<Map<String, Object>> getPlanningJour() {
        // En vrai production, on filtrerait aussi par l'Agent ou sa Structure. 
        // Ici on simplifie en prenant toutes les vaccinations prévues pour aujourd'hui.
        var aujourdhui = java.time.LocalDate.now();
        return ResponseEntity.ok(Map.of("success", true, "data", 
                vaccinationRepository.findByDatePrevueOrderByPatientNomAsc(aujourdhui)));
    }
}

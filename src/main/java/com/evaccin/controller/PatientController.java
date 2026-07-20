package com.evaccin.controller;

import com.evaccin.model.Patient;
import com.evaccin.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        return ResponseEntity.ok(Map.of("success", true, "data", patientRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(p -> ResponseEntity.ok(Map.of("success", (Object) true, "data", (Object) p)))
                .orElse(ResponseEntity.status(404).body(Map.of("success", false, "message", "Patient non trouvé")));
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> search(@RequestParam String q) {
        return ResponseEntity.ok(Map.of("success", true, "data", 
                patientRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCaseOrCodePatientContainingIgnoreCase(q, q, q)));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Patient patient) {
        if (patientRepository.existsByCodePatient(patient.getCodePatient())) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Code patient déjà existant"));
        }
        Patient saved = patientRepository.save(patient);
        return ResponseEntity.ok(Map.of("success", true, "data", saved));
    }
}

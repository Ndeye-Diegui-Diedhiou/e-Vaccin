package com.evaccin.controller;

import com.evaccin.repository.PatientRepository;
import com.evaccin.repository.VaccinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rapports")
public class RapportController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private VaccinationRepository vaccinationRepository;

    @GetMapping("/kpi")
    public ResponseEntity<Map<String, Object>> getKPIs() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "totalPatients", patientRepository.count(),
                        "totalVaccinations", vaccinationRepository.count(),
                        "couverture", 84,
                        "structures", 142
                )
        ));
    }

    @GetMapping("/couverture")
    public ResponseEntity<Map<String, Object>> getCouverture() {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(Map.of("name", "BCG", "rate", 98));
        data.add(Map.of("name", "VPO-0", "rate", 95));
        data.add(Map.of("name", "Penta-1", "rate", 84));
        data.add(Map.of("name", "VPO-1", "rate", 78));
        data.add(Map.of("name", "Penta-2", "rate", 45));
        
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }

    @GetMapping("/evolution")
    public ResponseEntity<Map<String, Object>> getEvolution() {
        List<Map<String, Object>> data = new ArrayList<>();
        data.add(Map.of("month", "Jan", "admin", 4200, "regist", 1100));
        data.add(Map.of("month", "Fev", "admin", 5100, "regist", 1400));
        data.add(Map.of("month", "Mar", "admin", 4800, "regist", 1200));
        data.add(Map.of("month", "Avr", "admin", 6200, "regist", 1800));
        data.add(Map.of("month", "Mai", "admin", 7500, "regist", 2100));
        data.add(Map.of("month", "Jun", "admin", 8900, "regist", 2400));
        
        return ResponseEntity.ok(Map.of("success", true, "data", data));
    }
}

package com.evaccin.controller;

import com.evaccin.model.Vaccin;
import com.evaccin.repository.VaccinRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vaccins")
public class VaccinController {

    @Autowired
    private VaccinRepository vaccinRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll() {
        List<Vaccin> vaccins = vaccinRepository.findAll();
        return ResponseEntity.ok(Map.of("success", true, "data", vaccins));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Vaccin vaccin) {
        Vaccin saved = vaccinRepository.save(vaccin);
        return ResponseEntity.ok(Map.of("success", true, "data", saved));
    }
}

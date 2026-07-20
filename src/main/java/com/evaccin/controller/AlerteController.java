package com.evaccin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alertes")
public class AlerteController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAlertes() {
        // Simulation d'alertes pour le dashboard
        List<Map<String, Object>> alertes = new ArrayList<>();
        alertes.add(Map.of("id", 1, "patientName", "Moussa Diop", "vaccin", "VPO-1", "datePrevue", "24/02/2026", "type", "retard", "urgency", "critique", "phone", "77 450 12 34"));
        alertes.add(Map.of("id", 2, "patientName", "Awa Ndiaye", "vaccin", "Penta-2", "datePrevue", "02/05/2026", "type", "today", "urgency", "normal", "phone", "78 123 45 67"));
        
        return ResponseEntity.ok(Map.of("success", true, "data", alertes));
    }

    @PostMapping("/{id}/sms")
    public ResponseEntity<Map<String, Object>> envoyerSMS(@PathVariable Long id) {
        // Simulation d'envoi SMS
        return ResponseEntity.ok(Map.of("success", true, "message", "SMS envoyé avec succès"));
    }
}

package com.evaccin.controller;

import com.evaccin.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        var result = authService.login(body.get("email"), body.get("password"));
        return ResponseEntity.ok(Map.of("success", true, "data", result));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        var user = authService.register(
                body.get("email"), body.get("password"),
                body.get("firstName"), body.get("lastName"),
                body.getOrDefault("role", "AGENT")
        );
        return ResponseEntity.ok(Map.of("success", true, "message", "Inscription réussie", "userId", user.getId()));
    }
}

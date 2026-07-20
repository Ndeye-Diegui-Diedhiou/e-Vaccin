package com.evaccin.config;

import com.evaccin.model.StructureSante;
import com.evaccin.model.User;
import com.evaccin.repository.StructureSanteRepository;
import com.evaccin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initialise des comptes de test au démarrage si la BDD est vide.
 * Comptes créés :
 *
 *   ADMIN   → admin@evaccin.sn      / Admin2026!
 *   MEDECIN → medecin@evaccin.sn    / Medecin2026!
 *   AGENT   → agent@evaccin.sn      / Agent2026!
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private StructureSanteRepository structureSanteRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return; // Déjà initialisé

        // ── Créer une structure de santé de test ──
        StructureSante structure = new StructureSante();
        structure.setNom("Centre de Santé Dakar-Plateau");
        structure.setRegion("Dakar");
        structure.setDistrict("Plateau");
        structure = structureSanteRepository.save(structure);

        // ── Créer les comptes ──
        createUser("Amadou", "Diallo",   "admin@evaccin.sn",   "Admin2026!",   "ADMIN",   structure);
        createUser("Fatou",  "Ndiaye",   "medecin@evaccin.sn", "Medecin2026!", "MEDECIN", structure);
        createUser("Moussa", "Sarr",     "agent@evaccin.sn",   "Agent2026!",   "AGENT",   structure);

        System.out.println("╔══════════════════════════════════════════════════╗");
        System.out.println("║       e-Vaccin — Comptes de test créés           ║");
        System.out.println("╠══════════════════════════════════════════════════╣");
        System.out.println("║  ADMIN    admin@evaccin.sn    | Admin2026!       ║");
        System.out.println("║  MÉDECIN  medecin@evaccin.sn  | Medecin2026!     ║");
        System.out.println("║  AGENT    agent@evaccin.sn    | Agent2026!       ║");
        System.out.println("╚══════════════════════════════════════════════════╝");
    }

    private void createUser(String prenom, String nom, String email,
                             String password, String role, StructureSante structure) {
        User u = new User();
        u.setFirstName(prenom);
        u.setLastName(nom);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(password));
        u.setRole(role);
        u.setIsActive(true);
        u.setStructureSante(structure);
        userRepository.save(u);
    }
}

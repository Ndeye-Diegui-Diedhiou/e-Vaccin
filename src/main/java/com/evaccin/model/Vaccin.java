package com.evaccin.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vaccins")
public class Vaccin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    @Column(name = "maladie_cible", nullable = false)
    private String maladieCible;

    @Column(name = "nombre_doses", nullable = false)
    private Integer nombreDoses;

    @Column(name = "intervalle_jours", nullable = false)
    private Integer intervalleJours;

    @Column(length = 20)
    private String abreviation;

    @Column(nullable = false)
    private Integer stock = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // ── Getters & Setters ──
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getMaladieCible() { return maladieCible; }
    public void setMaladieCible(String m) { this.maladieCible = m; }

    public Integer getNombreDoses() { return nombreDoses; }
    public void setNombreDoses(Integer n) { this.nombreDoses = n; }

    public Integer getIntervalleJours() { return intervalleJours; }
    public void setIntervalleJours(Integer i) { this.intervalleJours = i; }

    public String getAbreviation() { return abreviation; }
    public void setAbreviation(String a) { this.abreviation = a; }

    public Integer getStock() { return stock; }
    public void setStock(Integer s) { this.stock = s; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}

package com.evaccin.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vaccinations")
public class Vaccination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vaccin_id")
    private Vaccin vaccin;

    @ManyToOne
    @JoinColumn(name = "agent_id")
    private User agent;

    @Column(name = "numero_dose", nullable = false)
    private Integer numeroDose;

    @Column(name = "date_administration")
    private LocalDate dateAdministration;

    @Column(name = "date_prevue", nullable = false)
    private LocalDate datePrevue;

    @Column(nullable = false)
    private String statut; // FAIT, EN_ATTENTE, EN_RETARD

    @Column(name = "numero_lot")
    private String numeroLot;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Vaccination() {}

    @PrePersist
    protected void onCreate() { createdAt = LocalDateTime.now(); }

    // ── Getters & Setters ──
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient p) { this.patient = p; }

    public Vaccin getVaccin() { return vaccin; }
    public void setVaccin(Vaccin v) { this.vaccin = v; }

    public User getAgent() { return agent; }
    public void setAgent(User a) { this.agent = a; }

    public Integer getNumeroDose() { return numeroDose; }
    public void setNumeroDose(Integer n) { this.numeroDose = n; }

    public LocalDate getDateAdministration() { return dateAdministration; }
    public void setDateAdministration(LocalDate d) { this.dateAdministration = d; }

    public LocalDate getDatePrevue() { return datePrevue; }
    public void setDatePrevue(LocalDate d) { this.datePrevue = d; }

    public String getStatut() { return statut; }
    public void setStatut(String s) { this.statut = s; }

    public String getNumeroLot() { return numeroLot; }
    public void setNumeroLot(String n) { this.numeroLot = n; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}

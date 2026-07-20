package com.evaccin.repository;

import com.evaccin.model.Vaccin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccinRepository extends JpaRepository<Vaccin, Long> {
}

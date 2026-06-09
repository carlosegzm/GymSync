package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.PhysicalAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PhysicalAssessmentRepository extends JpaRepository<PhysicalAssessment, Long> {
    List<PhysicalAssessment> findByClientIdOrderByAssessmentDateAsc(UUID clientId);
}

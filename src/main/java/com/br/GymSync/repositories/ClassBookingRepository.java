package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.ClassBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ClassBookingRepository extends JpaRepository<ClassBooking, Long> {
    List<ClassBooking> findAllByClientId(UUID clientId);
    long countByGroupClassId(Long groupClassId);
    List<ClassBooking> findByGroupClassId(Long groupClassId);
}

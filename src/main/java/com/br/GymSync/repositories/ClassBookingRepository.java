package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.ClassBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassBookingRepository extends JpaRepository<ClassBooking, Long> {
    long countByGroupClassId(Long groupClassId);
}

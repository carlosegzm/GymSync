package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.AvailableTimeslot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AvailableTimeslotRepository extends JpaRepository<AvailableTimeslot, Long> {
    List<AvailableTimeslot> findByTrainerIdAndAvailableTrue(UUID trainerId);
    List<AvailableTimeslot> findByTrainerIdAndAvailableFalse(UUID trainerId);
}

package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.AvailableTimeslot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvailableTimeslotRepository extends JpaRepository<AvailableTimeslot, Long> {
}

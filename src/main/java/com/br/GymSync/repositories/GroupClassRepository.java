package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.GroupClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupClassRepository extends JpaRepository<GroupClass, Long> {
    List<GroupClass> findAllByGymId(UUID gymId);
    List<GroupClass> findAllByTrainerId(UUID trainerId);
}

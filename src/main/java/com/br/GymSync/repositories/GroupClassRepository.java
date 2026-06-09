package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.GroupClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupClassRepository extends JpaRepository<GroupClass, Long> {
}

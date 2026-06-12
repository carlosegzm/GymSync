package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GymRepository extends JpaRepository<Gym, UUID> {
    boolean existsByCnpj(String cnpj);
}

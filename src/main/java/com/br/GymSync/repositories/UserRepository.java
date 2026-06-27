package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.User;
import com.br.GymSync.domain.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    List<User> findAllByGymIdAndRole(UUID gymId, Role role);
}

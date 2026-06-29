package com.br.GymSync.repositories;

import com.br.GymSync.domain.entities.ClientSubscription;
import com.br.GymSync.domain.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClientSubscriptionRepository extends JpaRepository<ClientSubscription, UUID> {
    Optional<ClientSubscription> findByClientIdAndStatus(UUID clientId, SubscriptionStatus status);
    long countByStatusAndEndDateBetween(SubscriptionStatus status, LocalDate start, LocalDate end);
    long countByStatus(SubscriptionStatus status);
    List<ClientSubscription> findAllByPlanGymId(UUID gymId);
}

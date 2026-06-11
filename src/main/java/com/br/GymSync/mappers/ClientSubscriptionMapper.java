package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.ClientSubscription;
import com.br.GymSync.domain.entities.MembershipPlan;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.domain.enums.SubscriptionStatus;
import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionResponseDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ClientSubscriptionMapper {

    public ClientSubscription toEntity(User client, MembershipPlan plan, LocalDate startDate, LocalDate endDate) {
        return ClientSubscription.builder()
                .client(client)
                .plan(plan)
                .startDate(startDate)
                .endDate(endDate)
                .status(SubscriptionStatus.ACTIVE)
                .build();
    }

    public ClientSubscriptionResponseDTO toResponse(ClientSubscription entity) {
        return new ClientSubscriptionResponseDTO(
                entity.getId(),
                entity.getClient().getId(),
                entity.getPlan().getId(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.getStatus()
        );
    }

}

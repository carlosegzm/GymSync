package com.br.GymSync.dtos.clientsubscription;

import com.br.GymSync.domain.enums.SubscriptionStatus;
import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Builder
public record ClientSubscriptionResponseDTO(
        UUID id,
        UUID clientId,
        UUID planId,
        LocalDate startDate,
        LocalDate endDate,
        SubscriptionStatus status
) {
}

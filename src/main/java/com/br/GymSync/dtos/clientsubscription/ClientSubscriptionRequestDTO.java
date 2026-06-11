package com.br.GymSync.dtos.clientsubscription;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ClientSubscriptionRequestDTO(
        @NotNull(message = "Client ID is required")
        UUID clientId,

        @NotNull(message = "Plan ID is required")
        UUID planId
) {
}

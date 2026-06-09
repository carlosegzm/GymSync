package com.br.GymSync.dtos.classbooking;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ClassBookingRequestDTO(
        @NotNull(message = "Client ID is required")
        UUID clientId,

        @NotNull(message = "Group Class ID is required")
        Long groupClassId
) {
}

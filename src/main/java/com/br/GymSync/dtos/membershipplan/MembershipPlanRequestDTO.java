package com.br.GymSync.dtos.membershipplan;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record MembershipPlanRequestDTO(
        @NotBlank(message = "Plan name is required and cannot be blank")
        String name,

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be a positive value greater than zero")
        BigDecimal price,

        @NotNull(message = "Duration in months is required")
        @Positive(message = "Duration must be at least 1 month")
        Integer durationInMonths,

        @NotNull(message = "Gym ID is required")
        UUID gymId
) {
}

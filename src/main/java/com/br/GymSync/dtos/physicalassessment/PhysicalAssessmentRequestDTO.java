package com.br.GymSync.dtos.physicalassessment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Builder
public record PhysicalAssessmentRequestDTO(
        @NotNull(message = "Assessment date is required")
        LocalDate assessmentDate,

        @Positive(message = "Weight must be positive")
        double weight,

        @Positive(message = "Height must be positive")
        double height,

        @Positive(message = "Body fat percentage must be positive")
        double bodyFatPercentage,

        @NotNull(message = "Client ID is required")
        UUID clientId,

        @NotNull(message = "Trainer ID is required")
        UUID trainerId
) {
}

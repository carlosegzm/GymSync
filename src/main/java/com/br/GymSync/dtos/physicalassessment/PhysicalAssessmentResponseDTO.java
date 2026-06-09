package com.br.GymSync.dtos.physicalassessment;

import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Builder
public record PhysicalAssessmentResponseDTO(
        Long id,
        LocalDate assessmentDate,
        double weight,
        double height,
        double bodyFatPercentage,
        UUID clientId,
        UUID trainerId
) {
}

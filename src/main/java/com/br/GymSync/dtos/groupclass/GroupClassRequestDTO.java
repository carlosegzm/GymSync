package com.br.GymSync.dtos.groupclass;

import com.br.GymSync.domain.enums.ClassType;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record GroupClassRequestDTO(
        @NotBlank(message = "Name cannot be blank")
        String name,

        @NotNull(message = "Class type is required")
        ClassType classType,

        @NotNull(message = "Start date and time are required")
        @FutureOrPresent(message = "Date must be in the present or future")
        LocalDateTime startDateTime,

        @Min(value = 1, message = "Capacity must be at least 1")
        int maxCapacity,

        @NotNull(message = "Trainer ID is required")
        UUID trainerId
) {
}

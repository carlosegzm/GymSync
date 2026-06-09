package com.br.GymSync.dtos.availabletimeslot;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Builder
public record AvailableTimeslotRequestDTO(
        @NotNull(message = "Date is required")
        @FutureOrPresent(message = "Date must be in the present or future")
        LocalDate date,

        @NotNull(message = "Start time is required")
        LocalTime startTime,

        @NotNull(message = "End time is required")
        LocalTime endTime,

        @NotNull(message = "Trainer ID is required")
        UUID trainerId
) {
}

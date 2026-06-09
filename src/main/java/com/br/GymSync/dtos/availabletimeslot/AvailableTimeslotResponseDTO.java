package com.br.GymSync.dtos.availabletimeslot;

import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Builder
public record AvailableTimeslotResponseDTO(
        Long id,
        LocalDate date,
        LocalTime startTime,
        LocalTime endTime,
        boolean available,
        UUID trainerId
) {
}

package com.br.GymSync.dtos.classbooking;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record ClassBookingResponseDTO(
        Long id,
        LocalDateTime bookingDateTime,
        UUID clientId,
        Long groupClassId
) {
}

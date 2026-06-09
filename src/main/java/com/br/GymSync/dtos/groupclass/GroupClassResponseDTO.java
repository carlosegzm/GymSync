package com.br.GymSync.dtos.groupclass;

import com.br.GymSync.domain.enums.ClassType;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.UUID;

@Builder
public record GroupClassResponseDTO(
        Long id,
        String name,
        ClassType classType,
        LocalDateTime startDateTime,
        int maxCapacity,
        UUID trainerId
) {
}

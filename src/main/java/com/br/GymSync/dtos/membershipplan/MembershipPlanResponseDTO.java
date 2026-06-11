package com.br.GymSync.dtos.membershipplan;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record MembershipPlanResponseDTO(
        UUID id,
        String name,
        BigDecimal price,
        Integer durationInMonths,
        UUID gymId
) {
}

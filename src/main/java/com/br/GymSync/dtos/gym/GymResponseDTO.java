package com.br.GymSync.dtos.gym;

import lombok.Builder;

import java.util.UUID;

@Builder
public record GymResponseDTO(
        UUID id,
        String name,
        String cnpj
) {
}

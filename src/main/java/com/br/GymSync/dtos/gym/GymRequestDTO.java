package com.br.GymSync.dtos.gym;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record GymRequestDTO(
        @NotBlank(message = "Gym name is required and cannot be blank")
        String name,

        @NotBlank(message = "CNPJ is required and cannot be blank")
        String cnpj
) {
}

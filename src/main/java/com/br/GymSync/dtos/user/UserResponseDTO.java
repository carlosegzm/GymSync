package com.br.GymSync.dtos.user;

import com.br.GymSync.domain.enums.Role;
import lombok.Builder;

import java.util.UUID;

@Builder
public record UserResponseDTO(
        UUID id,
        String name,
        String email,
        Role role,
        String token
) {
}

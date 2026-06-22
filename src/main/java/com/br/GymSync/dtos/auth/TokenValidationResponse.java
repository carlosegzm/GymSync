package com.br.GymSync.dtos.auth;

import lombok.Builder;

@Builder
public record TokenValidationResponse(
        boolean valid,
        String subject
) {}
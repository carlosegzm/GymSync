package com.br.GymSync.exceptions;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
        LocalDateTime timestamp,
        Integer status,
        String error,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        Map<String, String> errors
) {
}

package com.br.GymSync.controllers;

import com.br.GymSync.config.TokenService;
import com.br.GymSync.dtos.auth.TokenValidationResponse;
import com.br.GymSync.dtos.user.LoginRequestDTO;
import com.br.GymSync.dtos.user.UserRequestDTO;
import com.br.GymSync.dtos.user.UserResponseDTO;
import com.br.GymSync.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> create(@Valid @RequestBody UserRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/validate")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER', 'CLIENT')")
    public ResponseEntity<TokenValidationResponse> validateToken(
            @RequestHeader("Authorization") String authHeader) {

        String subject = tokenService.validateToken(authHeader);

        return ResponseEntity.ok(
                TokenValidationResponse.builder()
                        .valid(!subject.isEmpty())
                        .subject(subject)
                        .build());
    }
}
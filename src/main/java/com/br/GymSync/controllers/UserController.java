package com.br.GymSync.controllers;

import com.br.GymSync.config.TokenService;
import com.br.GymSync.dtos.auth.TokenValidationResponse;
import com.br.GymSync.dtos.user.LoginRequestDTO;
import com.br.GymSync.dtos.user.UserRequestDTO;
import com.br.GymSync.dtos.user.UserResponseDTO;
import com.br.GymSync.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "User Authentication", description = "Endpoints for user onboarding, authentication, and session validation")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TokenService tokenService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<UserResponseDTO> create(@Valid @RequestBody UserRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user credentials and generate JWT token")
    public ResponseEntity<UserResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate an existing JWT authentication token session")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'CLIENT')")
    public ResponseEntity<TokenValidationResponse> validateToken(
            @RequestHeader("Authorization") String authHeader) {

        String subject = tokenService.validateToken(authHeader.substring(7)); // "Bearer "...

        return ResponseEntity.ok(
                TokenValidationResponse.builder()
                        .valid(!subject.isEmpty())
                        .subject(subject)
                        .build());
    }

    @GetMapping("/gym/{gymId}/clients")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    @Operation(summary = "Get all clients from a specific gym", description = "Returns a list of users with the CLIENT role associated with the provided gym ID.")
    public ResponseEntity<List<UserResponseDTO>> getClientsByGym(@PathVariable UUID gymId) {
        List<UserResponseDTO> clients = userService.findClientsByGym(gymId);
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/gym/{gymId}/trainers")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @Operation(summary = "Get all trainers from a specific gym", description = "Returns a list of users with the TRAINER role associated with the provided gym ID.")
    public ResponseEntity<List<UserResponseDTO>> getTrainersByGym(@PathVariable UUID gymId) {
        List<UserResponseDTO> trainers = userService.findTrainersByGym(gymId);
        return ResponseEntity.ok(trainers);
    }

    @GetMapping("/email/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Find user by email", description = "Searches for a user by their registered email. Useful for linking existing users to a gym.")
    public ResponseEntity<UserResponseDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findByEmail(email));
    }

    @PatchMapping("/{userId}/gym/{gymId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Link a user (Trainer or Client) to a Gym", description = "Associates an existing user with a specific gym. Only Admins can perform this action.")
    public ResponseEntity<UserResponseDTO> linkUserToGym(
            @PathVariable UUID userId,
            @PathVariable UUID gymId) {

        UserResponseDTO updatedUser = userService.associateToGym(userId, gymId);
        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/{userId}/gym/unlink")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Unlink a user from a Gym", description = "Removes the association between a user and their gym. Only Admins can perform this action.")
    public ResponseEntity<UserResponseDTO> unlinkUserFromGym(@PathVariable UUID userId) {
        UserResponseDTO updatedUser = userService.unlinkFromGym(userId);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'CLIENT')")
    @Operation(summary = "Get current authenticated user profile", description = "Returns the profile details of the currently logged-in user.")
    public ResponseEntity<UserResponseDTO> getMe(Authentication authentication) {
        String email = authentication.getName();

        UserResponseDTO currentUser = userService.findByEmail(email);
        return ResponseEntity.ok(currentUser);
    }

}
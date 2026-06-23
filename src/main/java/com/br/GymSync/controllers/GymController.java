package com.br.GymSync.controllers;

import com.br.GymSync.dtos.gym.GymRequestDTO;
import com.br.GymSync.dtos.gym.GymResponseDTO;
import com.br.GymSync.services.GymService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Gym Management", description = "Endpoints for registering and managing gym branches")
@RequestMapping("/api/gyms")
public class GymController {

    private final GymService gymService;

    @PostMapping
    @Operation(summary = "Register a new gym branch in the system")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<GymResponseDTO> create(@RequestBody GymRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gymService.create(request));
    }
}
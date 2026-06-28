package com.br.GymSync.controllers;

import com.br.GymSync.dtos.groupclass.GroupClassRequestDTO;
import com.br.GymSync.dtos.groupclass.GroupClassResponseDTO;
import com.br.GymSync.services.GroupClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Group Classes", description = "Endpoints for managing gym group class schedules (e.g., Zumba, Spinning)")
@RequestMapping("/api/group-classes")
public class GroupClassController {

    private final GroupClassService groupClassService;

    @PostMapping
    @Operation(summary = "Create a new group class schedule")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<GroupClassResponseDTO> create(@RequestBody GroupClassRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupClassService.create(request));
    }

    @GetMapping("/gym/{gymId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT', 'TRAINER')")
    @Operation(summary = "List all group classes for a specific gym")
    public ResponseEntity<List<GroupClassResponseDTO>> getClassesByGym(@PathVariable UUID gymId) {
        return ResponseEntity.ok(groupClassService.findClassesByGym(gymId));
    }

    @GetMapping("/trainer/me")
    @PreAuthorize("hasRole('TRAINER')")
    @Operation(summary = "List all group classes for the logged-in trainer")
    public ResponseEntity<List<GroupClassResponseDTO>> getMyTrainerClasses(org.springframework.security.core.Authentication authentication) {
        String trainerEmail = authentication.getName();
        return ResponseEntity.ok(groupClassService.findClassesByTrainerEmail(trainerEmail));
    }

}
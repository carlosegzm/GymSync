package com.br.GymSync.controllers;

import com.br.GymSync.dtos.membershipplan.MembershipPlanRequestDTO;
import com.br.GymSync.dtos.membershipplan.MembershipPlanResponseDTO;
import com.br.GymSync.services.MembershipPlanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Membership Plans", description = "Endpoints for managing corporate and individual gym membership plans")
@RequestMapping("/api/plans")
public class MembershipPlanController {

    private final MembershipPlanService planService;

    @PostMapping
    @Operation(summary = "Create a new membership plan for a gym")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MembershipPlanResponseDTO> create(@RequestBody MembershipPlanRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.create(request));
    }

    @GetMapping("/gym/{gymId}")
    @Operation(summary = "List all membership plans available at a specific gym")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'CLIENT')")
    public ResponseEntity<List<MembershipPlanResponseDTO>> listByGym(@PathVariable UUID gymId) {
        return ResponseEntity.ok(planService.listByGym(gymId));
    }
}
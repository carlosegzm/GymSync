package com.br.GymSync.controllers;

import com.br.GymSync.dtos.membershipplan.MembershipPlanRequestDTO;
import com.br.GymSync.dtos.membershipplan.MembershipPlanResponseDTO;
import com.br.GymSync.services.MembershipPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/plans")
public class MembershipPlanController {

    private final MembershipPlanService planService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<MembershipPlanResponseDTO> create(@RequestBody MembershipPlanRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planService.create(request));
    }

    @GetMapping("/gym/{gymId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER', 'CLIENT')")
    public ResponseEntity<List<MembershipPlanResponseDTO>> listByGym(@PathVariable UUID gymId) {
        return ResponseEntity.ok(planService.listByGym(gymId));
    }
}
package com.br.GymSync.controllers;

import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentRequestDTO;
import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentResponseDTO;
import com.br.GymSync.services.PhysicalAssessmentService;
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
@Tag(name = "Physical Assessments", description = "Endpoints for recording and tracking client physical evolution and health data")
@RequestMapping("/api/assessments")
public class PhysicalAssessmentController {

    private final PhysicalAssessmentService assessmentService;

    @PostMapping
    @Operation(summary = "Create a new physical assessment for a client")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    public ResponseEntity<PhysicalAssessmentResponseDTO> create(@RequestBody PhysicalAssessmentRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assessmentService.create(request));
    }

    @GetMapping("/client/{clientId}")
    @Operation(summary = "Retrieve the complete physical assessment history of a client")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER', 'CLIENT')")
    public ResponseEntity<List<PhysicalAssessmentResponseDTO>> getClientHistory(@PathVariable UUID clientId) {
        return ResponseEntity.ok(assessmentService.getClientHistory(clientId));
    }
}
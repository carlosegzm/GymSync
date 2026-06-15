package com.br.GymSync.controllers;

import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentRequestDTO;
import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentResponseDTO;
import com.br.GymSync.services.PhysicalAssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/assessments")
public class PhysicalAssessmentController {

    private final PhysicalAssessmentService assessmentService;

    @PostMapping
    public ResponseEntity<PhysicalAssessmentResponseDTO> create(@RequestBody PhysicalAssessmentRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assessmentService.create(request));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<PhysicalAssessmentResponseDTO>> getClientHistory(@PathVariable UUID clientId) {
        return ResponseEntity.ok(assessmentService.getClientHistory(clientId));
    }
}
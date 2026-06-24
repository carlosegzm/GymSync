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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Group Classes", description = "Endpoints for managing gym group class schedules (e.g., Zumba, Spinning)")
@RequestMapping("/api/group-classes")
public class GroupClassController {

    private final GroupClassService groupClassService;

    @PostMapping
    @Operation(summary = "Create a new group class schedule")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GroupClassResponseDTO> create(@RequestBody GroupClassRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupClassService.create(request));
    }

    @GetMapping
    @Operation(summary = "List all available group classes")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'CLIENT')")
    public ResponseEntity<List<GroupClassResponseDTO>> listAll() {
        return ResponseEntity.ok(groupClassService.listAllClasses());
    }
}
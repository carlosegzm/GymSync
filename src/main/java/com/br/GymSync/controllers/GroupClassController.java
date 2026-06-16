package com.br.GymSync.controllers;

import com.br.GymSync.dtos.groupclass.GroupClassRequestDTO;
import com.br.GymSync.dtos.groupclass.GroupClassResponseDTO;
import com.br.GymSync.services.GroupClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/group-classes")
public class GroupClassController {

    private final GroupClassService groupClassService;

    @PostMapping
    public ResponseEntity<GroupClassResponseDTO> create(@RequestBody GroupClassRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupClassService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<GroupClassResponseDTO>> listAll() {
        return ResponseEntity.ok(groupClassService.listAllClasses());
    }
}
package com.br.GymSync.controllers;

import com.br.GymSync.dtos.gym.GymRequestDTO;
import com.br.GymSync.dtos.gym.GymResponseDTO;
import com.br.GymSync.services.GymService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/gyms")
public class GymController {

    private final GymService gymService;

    @PostMapping
    public ResponseEntity<GymResponseDTO> create(@RequestBody GymRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(gymService.create(request));
    }
}
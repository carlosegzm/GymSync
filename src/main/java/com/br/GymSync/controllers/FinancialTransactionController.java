package com.br.GymSync.controllers;

import com.br.GymSync.dtos.financialltransaction.FinancialTransactionRequestDTO;
import com.br.GymSync.dtos.financialltransaction.FinancialTransactionResponseDTO;
import com.br.GymSync.services.FinancialTransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/finances")
public class FinancialTransactionController {

    private final FinancialTransactionService financeService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<FinancialTransactionResponseDTO> create(@RequestBody FinancialTransactionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financeService.create(request));
    }

    @GetMapping("/gym/{gymId}/balance")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BigDecimal> getGymBalance(@PathVariable UUID gymId) {
        return ResponseEntity.ok(financeService.calculateGymBalance(gymId));
    }
}
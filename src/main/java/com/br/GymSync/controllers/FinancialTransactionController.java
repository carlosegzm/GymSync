package com.br.GymSync.controllers;

import com.br.GymSync.dtos.financialltransaction.FinancialTransactionRequestDTO;
import com.br.GymSync.dtos.financialltransaction.FinancialTransactionResponseDTO;
import com.br.GymSync.services.FinancialTransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Financial Transactions", description = "Endpoints for managing gym cashflow and balances")
@RequestMapping("/api/finances")
public class FinancialTransactionController {

    private final FinancialTransactionService financeService;

    @PostMapping
    @Operation(summary = "Create a new financial transaction (revenue or expense)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FinancialTransactionResponseDTO> create(@RequestBody FinancialTransactionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financeService.create(request));
    }

    @GetMapping("/gym/{gymId}/balance")
    @Operation(summary = "Calculate the total financial balance of a gym")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BigDecimal> getGymBalance(@PathVariable UUID gymId) {
        return ResponseEntity.ok(financeService.calculateGymBalance(gymId));
    }
}
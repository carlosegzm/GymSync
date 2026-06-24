package com.br.GymSync.controllers;

import com.br.GymSync.services.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Dashboard Metrics", description = "Endpoints for retrieving system and gym administrative metrics")
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/{gymId}/metrics")
    @Operation(summary = "Get core administration metrics for a specific gym dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMetrics(@PathVariable UUID gymId) {
        return ResponseEntity.ok(dashboardService.getAdminDashboardMetrics(gymId));
    }
}
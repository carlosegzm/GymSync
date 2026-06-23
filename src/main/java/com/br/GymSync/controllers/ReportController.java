package com.br.GymSync.controllers;

import com.br.GymSync.services.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Reports", description = "Endpoints for generating and downloading administrative and health PDF reports")
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/finance/{gymId}")
    @Operation(summary = "Download financial statement extract PDF report for a gym")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<byte[]> downloadFinancialReport(@PathVariable UUID gymId) {
        return buildPdfResponse(reportService.generateFinancialExtractPdf(gymId), "financial-extract.pdf");
    }

    @GetMapping("/assessment/{clientId}")
    @Operation(summary = "Download complete physical assessment history PDF report for a client")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER', 'CLIENT')")
    public ResponseEntity<byte[]> downloadAssessmentHistory(@PathVariable UUID clientId) {
        return buildPdfResponse(reportService.generateClientAssessmentHistoryPdf(clientId), "assessment-history.pdf");
    }

    @GetMapping("/class-occupancy/{classId}")
    @Operation(summary = "Download occupancy rates and attendance PDF report for a group class")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    public ResponseEntity<byte[]> downloadClassOccupancy(@PathVariable Long classId) {
        return buildPdfResponse(reportService.generateClassOccupancyPdf(classId), "class-occupancy.pdf");
    }

    private ResponseEntity<byte[]> buildPdfResponse(byte[] pdfBytes, String filename) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", filename);
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
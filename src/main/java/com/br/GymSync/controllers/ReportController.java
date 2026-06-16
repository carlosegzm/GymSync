package com.br.GymSync.controllers;

import com.br.GymSync.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/finance/{gymId}")
    public ResponseEntity<byte[]> downloadFinancialReport(@PathVariable UUID gymId) {
        return buildPdfResponse(reportService.generateFinancialExtractPdf(gymId), "financial-extract.pdf");
    }

    @GetMapping("/assessment/{clientId}")
    public ResponseEntity<byte[]> downloadAssessmentHistory(@PathVariable UUID clientId) {
        return buildPdfResponse(reportService.generateClientAssessmentHistoryPdf(clientId), "assessment-history.pdf");
    }

    @GetMapping("/class-occupancy/{classId}")
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
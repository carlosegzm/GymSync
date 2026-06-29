package com.br.GymSync.controllers;

import com.br.GymSync.dtos.availabletimeslot.AvailableTimeslotResponseDTO;
import com.br.GymSync.services.AvailableTimeslotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Available Timeslots", description = "Endpoints for managing trainer schedules and slot bookings")
@RequestMapping("/api/timeslots")
public class AvailableTimeslotController {

    private final AvailableTimeslotService timeslotService;

    @PostMapping("/generate")
    @Operation(summary = "Bulk generate available timeslots for a trainer")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<List<AvailableTimeslotResponseDTO>> generateBulk(
            @RequestParam UUID trainerId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime,
            @RequestParam int durationMinutes) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(timeslotService.generateBulkSlots(trainerId, startDate, endDate, startTime, endTime, durationMinutes));
    }

    @GetMapping("/trainer/{trainerId}")
    @Operation(summary = "List all available timeslots for a specific trainer")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER', 'CLIENT')")
    public ResponseEntity<List<AvailableTimeslotResponseDTO>> listTrainerSlots(@PathVariable UUID trainerId) {
        return ResponseEntity.ok(timeslotService.listAvailableSlotsByTrainer(trainerId));
    }

    @PatchMapping("/{slotId}/book/client/{clientId}")
    @Operation(summary = "Book an available timeslot for a client")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<AvailableTimeslotResponseDTO> bookTimeslot(@PathVariable Long slotId, @PathVariable UUID clientId) {
        return ResponseEntity.ok(timeslotService.bookTimeslot(slotId, clientId));
    }

    @DeleteMapping("/{slotId}")
    @Operation(summary = "Cancel a timeslot")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<Void> cancelTimeslot(@PathVariable Long slotId) {
        timeslotService.cancelTimeslot(slotId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/trainer/me/booked")
    @Operation(summary = "List all booked timeslots for the logged-in trainer")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<AvailableTimeslotResponseDTO>> getMyBookedSlots(org.springframework.security.core.Authentication authentication) {
        String trainerEmail = authentication.getName();
        return ResponseEntity.ok(timeslotService.getMyBookedSlots(trainerEmail));
    }
}
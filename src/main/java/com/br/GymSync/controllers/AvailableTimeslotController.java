package com.br.GymSync.controllers;

import com.br.GymSync.dtos.availabletimeslot.AvailableTimeslotResponseDTO;
import com.br.GymSync.services.AvailableTimeslotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/timeslots")
public class AvailableTimeslotController {

    private final AvailableTimeslotService timeslotService;

    @PostMapping("/generate")
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
    public ResponseEntity<List<AvailableTimeslotResponseDTO>> listTrainerSlots(@PathVariable UUID trainerId) {
        return ResponseEntity.ok(timeslotService.listAvailableSlotsByTrainer(trainerId));
    }

    @PatchMapping("/{slotId}/book/client/{clientId}")
    public ResponseEntity<AvailableTimeslotResponseDTO> bookTimeslot(@PathVariable Long slotId, @PathVariable UUID clientId) {
        return ResponseEntity.ok(timeslotService.bookTimeslot(slotId, clientId));
    }

    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> cancelTimeslot(@PathVariable Long slotId) {
        timeslotService.cancelTimeslot(slotId);
        return ResponseEntity.noContent().build();
    }
}
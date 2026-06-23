package com.br.GymSync.controllers;

import com.br.GymSync.domain.enums.BookingStatus;
import com.br.GymSync.dtos.classbooking.ClassBookingRequestDTO;
import com.br.GymSync.dtos.classbooking.ClassBookingResponseDTO;
import com.br.GymSync.services.ClassBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/class-bookings")
public class ClassBookingController {

    private final ClassBookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    public ResponseEntity<ClassBookingResponseDTO> bookClass(@RequestBody ClassBookingRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    @PatchMapping("/{bookingId}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
    public ResponseEntity<Void> updateAttendance(@PathVariable Long bookingId, @RequestParam BookingStatus status) {
        bookingService.updateAttendance(bookingId, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{bookingId}/cancel/client/{clientId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId, @PathVariable UUID clientId) {
        bookingService.cancelBooking(bookingId, clientId);
        return ResponseEntity.noContent().build();
    }
}
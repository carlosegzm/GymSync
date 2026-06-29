package com.br.GymSync.controllers;

import com.br.GymSync.domain.enums.BookingStatus;
import com.br.GymSync.dtos.classbooking.ClassBookingRequestDTO;
import com.br.GymSync.dtos.classbooking.ClassBookingResponseDTO;
import com.br.GymSync.services.ClassBookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Class Bookings", description = "Endpoints for clients to book and manage group gym classes")
@RequestMapping("/api/class-bookings")
public class ClassBookingController {

    private final ClassBookingService bookingService;

    @PostMapping
    @Operation(summary = "Book a spot in a group class")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ClassBookingResponseDTO> bookClass(@RequestBody ClassBookingRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(request));
    }

    @PatchMapping("/{bookingId}/status")
    @Operation(summary = "Update client attendance status for a booking")
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<Void> updateAttendance(@PathVariable Long bookingId, @RequestParam BookingStatus status) {
        bookingService.updateAttendance(bookingId, status);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{bookingId}/cancel/client/{clientId}")
    @Operation(summary = "Cancel a class booking")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId, @PathVariable UUID clientId) {
        bookingService.cancelBooking(bookingId, clientId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/client/me")
    @PreAuthorize("hasRole('CLIENT')")
    @Operation(summary = "List all class bookings for the logged-in client")
    public ResponseEntity<List<ClassBookingResponseDTO>> getMyBookings(
            org.springframework.security.core.Authentication authentication) {
        String clientEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.findBookingsByClientEmail(clientEmail));
    }

}
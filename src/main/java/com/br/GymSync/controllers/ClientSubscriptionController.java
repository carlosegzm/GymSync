package com.br.GymSync.controllers;

import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionRequestDTO;
import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionResponseDTO;
import com.br.GymSync.services.ClientSubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Tag(name = "Client Subscriptions", description = "Endpoints for managing client gym memberships and subscriptions")
@RequestMapping("/api/subscriptions")
public class ClientSubscriptionController {

    private final ClientSubscriptionService subscriptionService;

    @PostMapping("/enroll")
    @Operation(summary = "Enroll a client into a membership plan")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<ClientSubscriptionResponseDTO> enroll(@RequestBody ClientSubscriptionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.enrollClient(request));
    }

    @PatchMapping("/{subscriptionId}/cancel")
    @Operation(summary = "Cancel an active client subscription")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    public ResponseEntity<Void> cancelSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.cancelSubscription(subscriptionId);
        return ResponseEntity.noContent().build();
    }
}
package com.br.GymSync.controllers;

import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionRequestDTO;
import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionResponseDTO;
import com.br.GymSync.services.ClientSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscriptions")
public class ClientSubscriptionController {

    private final ClientSubscriptionService subscriptionService;

    @PostMapping("/enroll")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    public ResponseEntity<ClientSubscriptionResponseDTO> enroll(@RequestBody ClientSubscriptionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.enrollClient(request));
    }

    @PatchMapping("/{subscriptionId}/cancel")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    public ResponseEntity<Void> cancelSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.cancelSubscription(subscriptionId);
        return ResponseEntity.noContent().build();
    }
}
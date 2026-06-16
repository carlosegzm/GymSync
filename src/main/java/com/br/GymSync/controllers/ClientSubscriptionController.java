package com.br.GymSync.controllers;

import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionRequestDTO;
import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionResponseDTO;
import com.br.GymSync.services.ClientSubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscriptions")
public class ClientSubscriptionController {

    private final ClientSubscriptionService subscriptionService;

    @PostMapping("/enroll")
    public ResponseEntity<ClientSubscriptionResponseDTO> enroll(@RequestBody ClientSubscriptionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.enrollClient(request));
    }

    @PatchMapping("/{subscriptionId}/cancel")
    public ResponseEntity<Void> cancelSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.cancelSubscription(subscriptionId);
        return ResponseEntity.noContent().build();
    }
}
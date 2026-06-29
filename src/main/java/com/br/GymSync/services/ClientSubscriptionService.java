package com.br.GymSync.services;

import com.br.GymSync.domain.entities.ClientSubscription;
import com.br.GymSync.domain.entities.MembershipPlan;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.domain.enums.SubscriptionStatus;
import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionRequestDTO;
import com.br.GymSync.dtos.clientsubscription.ClientSubscriptionResponseDTO;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.ClientSubscriptionMapper;
import com.br.GymSync.repositories.ClientSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientSubscriptionService {

    private final ClientSubscriptionRepository subscriptionRepository;
    private final ClientSubscriptionMapper subscriptionMapper;
    private final UserService userService;
    private final MembershipPlanService planService;
    private final FinancialTransactionService financialService;

    @Transactional
    public ClientSubscriptionResponseDTO enrollClient(ClientSubscriptionRequestDTO request) {
        subscriptionRepository.findByClientIdAndStatus(request.clientId(), SubscriptionStatus.ACTIVE)
                .ifPresent(sub -> {
                    throw new IllegalStateException("Client already has an active subscription!");
                });

        User client = userService.findEntityById(request.clientId());
        MembershipPlan plan = planService.findEntityById(request.planId());

        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusMonths(plan.getDurationInMonths());

        ClientSubscription subscription = subscriptionMapper.toEntity(client, plan, startDate, endDate);
        ClientSubscription savedSubscription = subscriptionRepository.save(subscription);

        financialService.registerAutomaticPayment(plan.getGym(), plan.getPrice(), client.getName());

        return subscriptionMapper.toResponse(savedSubscription);
    }

    @Transactional
    public void cancelSubscription(UUID subscriptionId) {
        ClientSubscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found."));

        subscription.setStatus(SubscriptionStatus.CANCELED);
        subscriptionRepository.save(subscription);
    }

    @Transactional(readOnly = true)
    public ClientSubscriptionResponseDTO getMyActiveSubscription(String clientEmail) {
        User client = userService.findEntityByEmail(clientEmail);

        ClientSubscription subscription = subscriptionRepository.findByClientIdAndStatus(client.getId(), SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("No active subscription found for this client."));

        return subscriptionMapper.toResponse(subscription);
    }

    @Transactional(readOnly = true)
    public List<ClientSubscriptionResponseDTO> findAllSubscriptionsByGym(UUID gymId) {
        return subscriptionRepository.findAllByPlanGymId(gymId)
                .stream()
                .map(subscriptionMapper::toResponse)
                .toList();
    }

}
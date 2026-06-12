package com.br.GymSync.services;

import com.br.GymSync.domain.enums.SubscriptionStatus;
import com.br.GymSync.repositories.ClientSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ClientSubscriptionRepository subscriptionRepository;
    private final FinancialTransactionService financialTransactionService;

    @Transactional(readOnly = true)
    public Map<String, Object> getAdminDashboardMetrics(UUID gymId) {
        Map<String, Object> metrics = new HashMap<>();

        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);
        long expiringSoon = subscriptionRepository.countByStatusAndEndDateBetween(
                SubscriptionStatus.ACTIVE, today, thirtyDaysFromNow
        );

        long activeClients = subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE);

        BigDecimal netBalance = financialTransactionService.calculateGymBalance(gymId);

        metrics.put("gymId", gymId);
        metrics.put("activeMembers", activeClients);
        metrics.put("membersExpiringIn30Days", expiringSoon);
        metrics.put("netFinancialBalance", netBalance);

        return metrics;
    }
}
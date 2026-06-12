package com.br.GymSync.services;

import com.br.GymSync.dtos.financialltransaction.FinancialTransactionRequestDTO;
import com.br.GymSync.dtos.financialltransaction.FinancialTransactionResponseDTO;
import com.br.GymSync.domain.entities.FinancialTransaction;
import com.br.GymSync.domain.entities.Gym;
import com.br.GymSync.domain.enums.TransactionCategory;
import com.br.GymSync.domain.enums.TransactionType;
import com.br.GymSync.mappers.FinancialTransactionMapper;
import com.br.GymSync.repositories.FinancialTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FinancialTransactionService {

    private final FinancialTransactionRepository transactionRepository;
    private final FinancialTransactionMapper transactionMapper;
    private final GymService gymService;

    @Transactional
    public FinancialTransactionResponseDTO create(FinancialTransactionRequestDTO request) {
        Gym gym = gymService.findEntityById(request.gymId());
        FinancialTransaction transaction = transactionMapper.toEntity(request, gym);
        return transactionMapper.toResponse(transactionRepository.save(transaction));
    }

    @Transactional
    public void registerAutomaticPayment(Gym gym, BigDecimal amount, String clientName) {
        FinancialTransaction transaction = FinancialTransaction.builder()
                .gym(gym)
                .amount(amount)
                .type(TransactionType.INCOME)
                .category(TransactionCategory.MEMBERSHIP_PAYMENT)
                .description("Automatic payment for client: " + clientName)
                .transactionDate(LocalDate.now())
                .build();
        transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public BigDecimal calculateGymBalance(UUID gymId) {
        List<FinancialTransaction> transactions = transactionRepository.findByGymId(gymId);
        BigDecimal income = transactions.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(FinancialTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expense = transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(FinancialTransaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return income.subtract(expense);
    }
}
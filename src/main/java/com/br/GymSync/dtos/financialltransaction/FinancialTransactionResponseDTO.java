package com.br.GymSync.dtos.financialltransaction;

import com.br.GymSync.domain.enums.TransactionCategory;
import com.br.GymSync.domain.enums.TransactionType;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Builder
public record FinancialTransactionResponseDTO(
        UUID id,
        String description,
        BigDecimal amount,
        TransactionType type,
        TransactionCategory category,
        LocalDate transactionDate,
        UUID gymId
) {
}

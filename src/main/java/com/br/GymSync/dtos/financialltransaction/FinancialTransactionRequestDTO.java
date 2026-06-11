package com.br.GymSync.dtos.financialltransaction;

import com.br.GymSync.domain.enums.TransactionCategory;
import com.br.GymSync.domain.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Builder
public record FinancialTransactionRequestDTO(
        @NotBlank(message = "Transaction description is required and cannot be blank")
        String description,

        @NotNull(message = "Transaction amount is required")
        @Positive(message = "Amount must be a positive value greater than zero")
        BigDecimal amount,

        @NotNull(message = "Transaction type (INCOME/EXPENSE) is required")
        TransactionType type,

        @NotNull(message = "Transaction category is required")
        TransactionCategory category,

        @NotNull(message = "Transaction date is required")
        LocalDate transactionDate,

        @NotNull(message = "Gym ID is required")
        UUID gymId
) {
}

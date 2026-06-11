package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.FinancialTransaction;
import com.br.GymSync.domain.entities.Gym;
import com.br.GymSync.dtos.financialltransaction.FinancialTransactionRequestDTO;
import com.br.GymSync.dtos.financialltransaction.FinancialTransactionResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class FinancialTransactionMapper {

    public FinancialTransaction toEntity(FinancialTransactionRequestDTO request, Gym gym) {
        return FinancialTransaction.builder()
                .description(request.description())
                .amount(request.amount())
                .type(request.type())
                .category(request.category())
                .transactionDate(request.transactionDate())
                .gym(gym)
                .build();
    }

    public FinancialTransactionResponseDTO toResponse(FinancialTransaction entity) {
        return new FinancialTransactionResponseDTO(
                entity.getId(),
                entity.getDescription(),
                entity.getAmount(),
                entity.getType(),
                entity.getCategory(),
                entity.getTransactionDate(),
                entity.getGym().getId()
        );
    }

}

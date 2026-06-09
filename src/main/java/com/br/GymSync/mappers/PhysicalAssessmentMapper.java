package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.PhysicalAssessment;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentRequestDTO;
import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class PhysicalAssessmentMapper {

    private PhysicalAssessment toEntity(PhysicalAssessmentRequestDTO request, User client, User trainer){
        return PhysicalAssessment.builder()
                .assessmentDate(request.assessmentDate())
                .weight(request.weight())
                .height(request.height())
                .bodyFatPercentage(request.bodyFatPercentage())
                .client(client)
                .trainer(trainer)
                .build();
    }

    private PhysicalAssessmentResponseDTO toResponse(PhysicalAssessment physicalAssessment) {
        return PhysicalAssessmentResponseDTO.builder()
                .id(physicalAssessment.getId())
                .assessmentDate(physicalAssessment.getAssessmentDate())
                .weight(physicalAssessment.getWeight())
                .height(physicalAssessment.getHeight())
                .bodyFatPercentage(physicalAssessment.getBodyFatPercentage())
                .clientId(physicalAssessment.getClient().getId())
                .trainerId(physicalAssessment.getTrainer().getId())
                .build();
    }

}

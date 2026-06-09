package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.GroupClass;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.dtos.groupclass.GroupClassRequestDTO;
import com.br.GymSync.dtos.groupclass.GroupClassResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class GroupClassMapper {

    private GroupClass toEntity(GroupClassRequestDTO request, User trainer) {
        return GroupClass.builder()
                .name(request.name())
                .classType(request.classType())
                .startDateTime(request.startDateTime())
                .maxCapacity(request.maxCapacity())
                .trainer(trainer)
                .build();
    }

    private GroupClassResponseDTO toResponse(GroupClass groupClass) {
        return GroupClassResponseDTO.builder()
                .id(groupClass.getId())
                .name(groupClass.getName())
                .classType(groupClass.getClassType())
                .startDateTime(groupClass.getStartDateTime())
                .maxCapacity(groupClass.getMaxCapacity())
                .trainerId(groupClass.getTrainer().getId())
                .build();
    }



}

package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.AvailableTimeslot;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.dtos.availabletimeslot.AvailableTimeslotRequestDTO;
import com.br.GymSync.dtos.availabletimeslot.AvailableTimeslotResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class AvailableTimeslotMapper {

    public AvailableTimeslot toEntity(AvailableTimeslotRequestDTO request, User trainer){
        return AvailableTimeslot.builder()
                .date(request.date())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .available(true) //todo horario novo eh disponivel
                .trainer(trainer)
                .build();
    }

    public AvailableTimeslotResponseDTO toResponse(AvailableTimeslot availableTimeslot){
        return AvailableTimeslotResponseDTO.builder()
                .id(availableTimeslot.getId())
                .date(availableTimeslot.getDate())
                .startTime(availableTimeslot.getStartTime())
                .endTime(availableTimeslot.getEndTime())
                .available(availableTimeslot.isAvailable())
                .trainerId(availableTimeslot.getTrainer().getId())
                .build();
    }

}

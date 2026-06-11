package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.Gym;
import com.br.GymSync.dtos.gym.GymRequestDTO;
import com.br.GymSync.dtos.gym.GymResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class GymMapper {

    public Gym toEntity(GymRequestDTO request) {
        return Gym.builder()
                .name(request.name())
                .cnpj(request.cnpj())
                .build();
    }

    public GymResponseDTO toResponse(Gym entity) {
        return new GymResponseDTO(entity.getId(), entity.getName(), entity.getCnpj());
    }

}

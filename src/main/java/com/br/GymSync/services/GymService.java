package com.br.GymSync.services;

import com.br.GymSync.domain.entities.Gym;
import com.br.GymSync.dtos.gym.GymRequestDTO;
import com.br.GymSync.dtos.gym.GymResponseDTO;
import com.br.GymSync.exceptions.custom.CnpjAlreadyExistsException;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.GymMapper;
import com.br.GymSync.repositories.GymRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@RequiredArgsConstructor
@Service
public class GymService {

    private final GymRepository gymRepository;
    private final GymMapper gymMapper;

    @Transactional
    public GymResponseDTO create(GymRequestDTO request) {
        if (gymRepository.existsByCnpj(request.cnpj())) {
            throw new CnpjAlreadyExistsException("A gym with this CNPJ already exists.");
        }
        Gym gym = gymMapper.toEntity(request);
        return gymMapper.toResponse(gymRepository.save(gym));
    }

    @Transactional(readOnly = true)
    public Gym findEntityById(UUID id) {
        return gymRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gym not found with ID: " + id));
    }

}

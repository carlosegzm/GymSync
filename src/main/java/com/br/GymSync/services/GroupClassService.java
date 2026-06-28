package com.br.GymSync.services;

import com.br.GymSync.dtos.groupclass.GroupClassRequestDTO;
import com.br.GymSync.dtos.groupclass.GroupClassResponseDTO;
import com.br.GymSync.domain.entities.GroupClass;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.GroupClassMapper;
import com.br.GymSync.repositories.GroupClassRepository;
import com.br.GymSync.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupClassService {

    private final GroupClassRepository groupClassRepository;
    private final UserRepository userRepository;
    private final GroupClassMapper groupClassMapper;
    private final UserService userService;

    @Transactional
    public GroupClassResponseDTO create(GroupClassRequestDTO request) {
        User trainer = userService.findEntityById(request.trainerId());

        GroupClass groupClass = groupClassMapper.toEntity(request, trainer);
        GroupClass savedClass = groupClassRepository.save(groupClass);

        return groupClassMapper.toResponse(savedClass);
    }

    @Transactional(readOnly = true)
    public GroupClass findEntityById(Long id) {
        return groupClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Group Class not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<GroupClassResponseDTO> findClassesByGym(UUID gymId) {
        return groupClassRepository.findAllByGymId(gymId)
                .stream()
                .map(groupClassMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GroupClassResponseDTO> findClassesByTrainerEmail(String trainerEmail) {
        User trainer = userRepository.findByEmail(trainerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with email: " + trainerEmail));

        return groupClassRepository.findAllByTrainerId(trainer.getId())
                .stream()
                .map(groupClassMapper::toResponse)
                .toList();
    }

}
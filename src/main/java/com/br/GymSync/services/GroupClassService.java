package com.br.GymSync.services;

import com.br.GymSync.dtos.groupclass.GroupClassRequestDTO;
import com.br.GymSync.dtos.groupclass.GroupClassResponseDTO;
import com.br.GymSync.domain.entities.GroupClass;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.GroupClassMapper;
import com.br.GymSync.repositories.GroupClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GroupClassService {

    private final GroupClassRepository groupClassRepository;
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
}
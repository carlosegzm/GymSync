package com.br.GymSync.services;

import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentRequestDTO;
import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentResponseDTO;
import com.br.GymSync.domain.entities.PhysicalAssessment;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.PhysicalAssessmentMapper;
import com.br.GymSync.repositories.PhysicalAssessmentRepository;
import com.br.GymSync.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhysicalAssessmentService {

    private final PhysicalAssessmentRepository assessmentRepository;
    private final UserRepository userRepository;
    private final PhysicalAssessmentMapper assessmentMapper;
    private final UserService userService;

    @Transactional
    public PhysicalAssessmentResponseDTO create(PhysicalAssessmentRequestDTO request, String trainerEmail) {

        User trainer = userRepository.findByEmail(trainerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Trainer not found with email: " + trainerEmail));

        User client = userService.findEntityById(request.clientId());

        PhysicalAssessment assessment = assessmentMapper.toEntity(request, client, trainer);
        PhysicalAssessment savedAssessment = assessmentRepository.save(assessment);

        return assessmentMapper.toResponse(savedAssessment);
    }

    @Transactional(readOnly = true)
    public List<PhysicalAssessmentResponseDTO> getClientHistory(UUID clientId) {
        return assessmentRepository.findByClientIdOrderByAssessmentDateAsc(clientId)
                .stream()
                .map(assessmentMapper::toResponse)
                .toList();
    }
}
package com.br.GymSync.services;

import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentRequestDTO;
import com.br.GymSync.dtos.physicalassessment.PhysicalAssessmentResponseDTO;
import com.br.GymSync.domain.entities.PhysicalAssessment;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.mappers.PhysicalAssessmentMapper;
import com.br.GymSync.repositories.PhysicalAssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhysicalAssessmentService {

    private final PhysicalAssessmentRepository assessmentRepository;
    private final PhysicalAssessmentMapper assessmentMapper;
    private final UserService userService;

    @Transactional
    public PhysicalAssessmentResponseDTO create(PhysicalAssessmentRequestDTO request) {
        User client = userService.findEntityById(request.clientId());
        User trainer = userService.findEntityById(request.trainerId());

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
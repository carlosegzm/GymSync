package com.br.GymSync.services;

import com.br.GymSync.domain.entities.Gym;
import com.br.GymSync.domain.entities.MembershipPlan;
import com.br.GymSync.dtos.membershipplan.MembershipPlanRequestDTO;
import com.br.GymSync.dtos.membershipplan.MembershipPlanResponseDTO;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.MembershipPlanMapper;
import com.br.GymSync.repositories.MembershipPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class MembershipPlanService {

    private final MembershipPlanRepository planRepository;
    private final MembershipPlanMapper planMapper;
    private final GymService gymService;

    @Transactional
    public MembershipPlanResponseDTO create(MembershipPlanRequestDTO request) {
        Gym gym = gymService.findEntityById(request.gymId());
        MembershipPlan plan = planMapper.toEntity(request, gym);
        return planMapper.toResponse(planRepository.save(plan));
    }

    @Transactional(readOnly = true)
    public List<MembershipPlanResponseDTO> listByGym(UUID gymId) {
        return planRepository.findByGymId(gymId).stream()
                .map(planMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public MembershipPlan findEntityById(UUID id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with ID: " + id));
    }

}

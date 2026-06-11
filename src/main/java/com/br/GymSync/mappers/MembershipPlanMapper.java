package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.Gym;
import com.br.GymSync.domain.entities.MembershipPlan;
import com.br.GymSync.dtos.membershipplan.MembershipPlanRequestDTO;
import com.br.GymSync.dtos.membershipplan.MembershipPlanResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class MembershipPlanMapper {

    public MembershipPlan toEntity(MembershipPlanRequestDTO request, Gym gym) {
        return MembershipPlan.builder()
                .name(request.name())
                .price(request.price())
                .durationInMonths(request.durationInMonths())
                .gym(gym)
                .build();
    }

    public MembershipPlanResponseDTO toResponse(MembershipPlan entity) {
        return new MembershipPlanResponseDTO(
                entity.getId(),
                entity.getName(),
                entity.getPrice(),
                entity.getDurationInMonths(),
                entity.getGym().getId()
        );
    }

}

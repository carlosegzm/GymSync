package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.ClassBooking;
import com.br.GymSync.domain.entities.GroupClass;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.dtos.classbooking.ClassBookingRequestDTO;
import com.br.GymSync.dtos.classbooking.ClassBookingResponseDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ClassBookingMapper {

    private ClassBooking toEntity(ClassBookingRequestDTO request, User client, GroupClass groupClass){
        return ClassBooking.builder()
                .client(client)
                .groupClass(groupClass)
                .bookingDateTime(LocalDateTime.now())
                .build();
    }

    private ClassBookingResponseDTO toResponse(ClassBooking classBooking){
        return ClassBookingResponseDTO.builder()
                .id(classBooking.getId())
                .bookingDateTime(classBooking.getBookingDateTime())
                .clientId(classBooking.getClient().getId())
                .groupClassId(classBooking.getGroupClass().getId())
                .build();
    }

}

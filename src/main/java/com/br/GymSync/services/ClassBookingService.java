package com.br.GymSync.services;

import com.br.GymSync.dtos.classbooking.ClassBookingRequestDTO;
import com.br.GymSync.dtos.classbooking.ClassBookingResponseDTO;
import com.br.GymSync.domain.entities.ClassBooking;
import com.br.GymSync.domain.entities.GroupClass;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.exceptions.custom.ClassClassroomFullException;
import com.br.GymSync.mappers.ClassBookingMapper;
import com.br.GymSync.repositories.ClassBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClassBookingService {

    private final ClassBookingRepository bookingRepository;
    private final ClassBookingMapper bookingMapper;
    private final UserService userService;
    private final GroupClassService groupClassService;

    @Transactional
    public ClassBookingResponseDTO createBooking(ClassBookingRequestDTO request) {
        User client = userService.findEntityById(request.clientId());
        GroupClass groupClass = groupClassService.findEntityById(request.groupClassId());

        long currentBookings = bookingRepository.countByGroupClassId(groupClass.getId());
        if (currentBookings >= groupClass.getMaxCapacity()) {
            throw new ClassClassroomFullException("This class has already reached its maximum capacity!");
        }

        ClassBooking booking = bookingMapper.toEntity(request, client, groupClass);
        ClassBooking savedBooking = bookingRepository.save(booking);

        return bookingMapper.toResponse(savedBooking);
    }
}
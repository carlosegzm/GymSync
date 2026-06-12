package com.br.GymSync.services;

import com.br.GymSync.domain.enums.BookingStatus;
import com.br.GymSync.domain.enums.SubscriptionStatus;
import com.br.GymSync.dtos.classbooking.ClassBookingRequestDTO;
import com.br.GymSync.dtos.classbooking.ClassBookingResponseDTO;
import com.br.GymSync.domain.entities.ClassBooking;
import com.br.GymSync.domain.entities.GroupClass;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.exceptions.custom.ActiveSubscriptionRequiredException;
import com.br.GymSync.exceptions.custom.ClassClassroomFullException;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.ClassBookingMapper;
import com.br.GymSync.repositories.ClassBookingRepository;
import com.br.GymSync.repositories.ClientSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClassBookingService {

    private final ClassBookingRepository bookingRepository;
    private final ClientSubscriptionRepository subscriptionRepository;
    private final ClassBookingMapper bookingMapper;
    private final UserService userService;
    private final GroupClassService groupClassService;

    @Transactional
    public ClassBookingResponseDTO createBooking(ClassBookingRequestDTO request) {
        User client = userService.findEntityById(request.clientId());
        GroupClass groupClass = groupClassService.findEntityById(request.groupClassId());

        subscriptionRepository.findByClientIdAndStatus(client.getId(), SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new ActiveSubscriptionRequiredException("Client does not have an active subscription!"));

        long currentBookings = bookingRepository.countByGroupClassId(groupClass.getId());
        if (currentBookings >= groupClass.getMaxCapacity()) {
            throw new ClassClassroomFullException("This class has already reached its maximum capacity!");
        }

        ClassBooking booking = bookingMapper.toEntity(request, client, groupClass);
        ClassBooking savedBooking = bookingRepository.save(booking);

        return bookingMapper.toResponse(savedBooking);
    }

    @Transactional
    public void updateAttendance(Long bookingId, BookingStatus newStatus) {
        ClassBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking registration not found."));

        booking.setStatus(newStatus);
        bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(Long bookingId, UUID clientId) {
        ClassBooking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking registration not found."));

        if (!booking.getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("You can only cancel your own bookings.");
        }

        bookingRepository.delete(booking);
    }

}
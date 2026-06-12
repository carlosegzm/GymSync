package com.br.GymSync.services;

import com.br.GymSync.dtos.availabletimeslot.AvailableTimeslotResponseDTO;
import com.br.GymSync.domain.entities.AvailableTimeslot;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.domain.enums.Role;
import com.br.GymSync.exceptions.custom.InvalidUserRoleException;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.AvailableTimeslotMapper;
import com.br.GymSync.repositories.AvailableTimeslotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AvailableTimeslotService {

    private final AvailableTimeslotRepository timeslotRepository;
    private final AvailableTimeslotMapper timeslotMapper;
    private final UserService userService;

    @Transactional
    public List<AvailableTimeslotResponseDTO> generateBulkSlots(
            UUID trainerId, LocalDate startDate, LocalDate endDate,
            LocalTime startTime, LocalTime endTime, int durationMinutes) {

        User trainer = userService.findEntityById(trainerId);
        if (trainer.getRole() != Role.TRAINER) {
            throw new InvalidUserRoleException("User is not a trainer!");
        }

        List<AvailableTimeslot> slotsToSave = new ArrayList<>();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            LocalTime currentSlotTime = startTime;

            while (!currentSlotTime.plusMinutes(durationMinutes).isAfter(endTime)) {
                AvailableTimeslot slot = AvailableTimeslot.builder()
                        .date(date)
                        .startTime(currentSlotTime)
                        .endTime(currentSlotTime.plusMinutes(durationMinutes))
                        .available(true)
                        .trainer(trainer)
                        .build();

                slotsToSave.add(slot);
                currentSlotTime = currentSlotTime.plusMinutes(durationMinutes);
            }
        }

        List<AvailableTimeslot> savedSlots = timeslotRepository.saveAll(slotsToSave);
        return savedSlots.stream().map(timeslotMapper::toResponse).toList();
    }

    @Transactional
    public void cancelTimeslot(Long slotId) {
        AvailableTimeslot slot = timeslotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Timeslot not found."));

        if (!slot.isAvailable()) {
            throw new IllegalStateException("Cannot cancel a timeslot that has already been booked by a client.");
        }

        timeslotRepository.delete(slot);
    }

    @Transactional(readOnly = true)
    public List<AvailableTimeslotResponseDTO> listAvailableSlotsByTrainer(UUID trainerId) {
        return timeslotRepository.findByTrainerIdAndAvailableTrue(trainerId)
                .stream()
                .map(timeslotMapper::toResponse)
                .toList();
    }

    @Transactional
    public AvailableTimeslotResponseDTO bookTimeslot(Long slotId, UUID clientId) {
        AvailableTimeslot slot = timeslotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Timeslot not found with ID: " + slotId));

        if (!slot.isAvailable()) {
            throw new IllegalStateException("This timeslot is already booked by another client.");
        }

        User client = userService.findEntityById(clientId);

        slot.setAvailable(false);
        slot.setClient(client);

        AvailableTimeslot savedSlot = timeslotRepository.save(slot);
        return timeslotMapper.toResponse(savedSlot);
    }

}
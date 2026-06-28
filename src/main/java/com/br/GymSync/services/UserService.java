package com.br.GymSync.services;

import com.br.GymSync.domain.entities.Gym;
import com.br.GymSync.domain.enums.Role;
import com.br.GymSync.dtos.user.LoginRequestDTO;
import com.br.GymSync.dtos.user.UserRequestDTO;
import com.br.GymSync.dtos.user.UserResponseDTO;
import com.br.GymSync.config.TokenService;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.exceptions.custom.EmailAlreadyExistsException;
import com.br.GymSync.exceptions.custom.InvalidCredentialsException;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.UserMapper;
import com.br.GymSync.repositories.GymRepository;
import com.br.GymSync.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final GymRepository gymRepository;

    @Transactional
    public UserResponseDTO create(UserRequestDTO request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already registered!");
        }

        User user = userMapper.toEntity(request);

        String encodedPassword = passwordEncoder.encode(request.password());
        user.setPassword(encodedPassword);

        User savedUser = userRepository.save(user);

        String token = tokenService.generateToken(savedUser);

        return userMapper.toResponse(savedUser, token);
    }

    @Transactional(readOnly = true)
    public User findEntityById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    public User findEntityByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional(readOnly = true)
    public UserResponseDTO login(LoginRequestDTO request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        String token = tokenService.generateToken(user);

        return userMapper.toResponse(user, token);
    }

    public List<UserResponseDTO> findClientsByGym(UUID gymId) {
        List<User> clients = userRepository.findAllByGymIdAndRole(gymId, Role.CLIENT);

        return clients.stream()
                .map(userMapper::toResponse)
                .toList();
    }

    public List<UserResponseDTO> findTrainersByGym(UUID gymId) {
        List<User> trainers = userRepository.findAllByGymIdAndRole(gymId, Role.TRAINER);

        return trainers.stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponseDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponseDTO associateToGym(UUID userId, UUID gymId) {
        User user = findEntityById(userId);

        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new ResourceNotFoundException("Gym not found with ID: " + gymId));

        user.setGym(gym);

        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponseDTO unlinkFromGym(UUID userId) {
        User user = findEntityById(userId);
        user.setGym(null);
        return userMapper.toResponse(user);
    }

}
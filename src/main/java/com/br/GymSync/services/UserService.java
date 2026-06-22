package com.br.GymSync.services;

import com.br.GymSync.dtos.user.UserRequestDTO;
import com.br.GymSync.dtos.user.UserResponseDTO;
import com.br.GymSync.config.TokenService;
import com.br.GymSync.domain.entities.User;
import com.br.GymSync.exceptions.custom.EmailAlreadyExistsException;
import com.br.GymSync.exceptions.custom.InvalidCredentialsException;
import com.br.GymSync.exceptions.custom.ResourceNotFoundException;
import com.br.GymSync.mappers.UserMapper;
import com.br.GymSync.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    private final TokenService tokenService;

    @Transactional
    public UserResponseDTO create(UserRequestDTO request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new EmailAlreadyExistsException("Email already registered!");
        }

        User user = userMapper.toEntity(request);
        User savedUser = userRepository.save(user);

        String token = tokenService.generateToken(savedUser);

        return userMapper.toResponse(savedUser, token);
    }

    @Transactional(readOnly = true)
    public User findEntityById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public UserResponseDTO login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!user.getPassword().equals(password)) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        String token = tokenService.generateToken(user);

        return userMapper.toResponse(user, token);
    }

    public String validateToken(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        
        return tokenService.validateToken(token);
    }
}
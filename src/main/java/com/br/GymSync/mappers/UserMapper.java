package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.User;
import com.br.GymSync.dtos.user.UserRequestDTO;
import com.br.GymSync.dtos.user.UserResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRequestDTO request) {
        return User.builder()
                .name(request.name())
                .email(request.email())
                .password(request.password())
                .role(request.role())
                .build();
    }

    public UserResponseDTO toResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public UserResponseDTO toResponse(User user, String token) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .token(token)
                .gymId(user.getGym() != null ? user.getGym().getId() : null)
                .build();
    }

}

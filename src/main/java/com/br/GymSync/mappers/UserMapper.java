package com.br.GymSync.mappers;

import com.br.GymSync.domain.entities.User;
import com.br.GymSync.dtos.user.UserRequestDTO;
import com.br.GymSync.dtos.user.UserResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    private User toEntity(UserRequestDTO request) {
        return User.builder()
                .name(request.name())
                .email(request.email())
                .password(request.password())
                .role(request.role())
                .build();
    }

    private UserResponseDTO toResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

}

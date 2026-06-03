package com.br.GymSync.domain.entities;

import com.br.GymSync.domain.enums.ClassType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "group_class")
public class GroupClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ClassType classType;

    @Column(nullable = false)
    private LocalDateTime startDateTime;

    @Max(40)
    @Column(nullable = false)
    private int maxCapacity;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;


}

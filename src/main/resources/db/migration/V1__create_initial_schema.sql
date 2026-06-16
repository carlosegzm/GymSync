CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE group_class (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class_type VARCHAR(50) NOT NULL,
    start_date_time TIMESTAMP NOT NULL,
    max_capacity INTEGER NOT NULL,
    trainer_id UUID NOT NULL,
    CONSTRAINT fk_group_class_trainer FOREIGN KEY (trainer_id) REFERENCES users(id)
);

CREATE TABLE available_timeslot (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    available BOOLEAN NOT NULL,
    trainer_id UUID NOT NULL,
    client_id UUID,
    CONSTRAINT fk_timeslot_trainer FOREIGN KEY (trainer_id) REFERENCES users(id),
    CONSTRAINT fk_timeslot_client FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE class_booking (
    id BIGSERIAL PRIMARY KEY,
    booking_date_time TIMESTAMP NOT NULL,
    client_id UUID NOT NULL,
    group_class_id BIGINT NOT NULL,
    CONSTRAINT fk_booking_client FOREIGN KEY (client_id) REFERENCES users(id),
    CONSTRAINT fk_booking_group_class FOREIGN KEY (group_class_id) REFERENCES group_class(id)
);

CREATE TABLE physical_assessment (
    id BIGSERIAL PRIMARY KEY,
    assessment_date DATE NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    height DOUBLE PRECISION NOT NULL,
    body_fat_percentage DOUBLE PRECISION NOT NULL,
    client_id UUID NOT NULL,
    trainer_id UUID NOT NULL,
    CONSTRAINT fk_assessment_client FOREIGN KEY (client_id) REFERENCES users(id),
    CONSTRAINT fk_assessment_trainer FOREIGN KEY (trainer_id) REFERENCES users(id)
);
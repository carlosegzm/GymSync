CREATE TABLE gyms (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE membership_plans (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_in_months INTEGER NOT NULL,
    gym_id UUID NOT NULL,
    CONSTRAINT fk_plan_gym FOREIGN KEY (gym_id) REFERENCES gyms(id)
);

CREATE TABLE client_subscriptions (
    id UUID PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    client_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    CONSTRAINT fk_sub_client FOREIGN KEY (client_id) REFERENCES users(id),
    CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id) REFERENCES membership_plans(id)
);

CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    gym_id UUID NOT NULL,
    CONSTRAINT fk_transaction_gym FOREIGN KEY (gym_id) REFERENCES gyms(id)
);

ALTER TABLE users ADD COLUMN gym_id UUID;
ALTER TABLE users ADD CONSTRAINT fk_user_gym FOREIGN KEY (gym_id) REFERENCES gyms(id);

ALTER TABLE class_booking ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'PENDING';
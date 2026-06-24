-- Inserindo os perfis de teste sugeridos pelo frontend
-- A senha de todos é: 123456 (Criptografada com o BCrypt do projeto)

INSERT INTO users (id, name, email, password, role) VALUES
(gen_random_uuid(), 'Admin Profile', 'admin@gymsync.com', '$2a$10$EooeTEZh.QpaVnPCjYW3AezgrZvZwmbwK33Zh506ZhpzhIbIbRxiC', 'ADMIN'),
(gen_random_uuid(), 'Trainer Profile', 'trainer@gymsync.com', '$2a$10$EooeTEZh.QpaVnPCjYW3AezgrZvZwmbwK33Zh506ZhpzhIbIbRxiC', 'TRAINER'),
(gen_random_uuid(), 'Client Profile', 'client@gymsync.com', '$2a$10$EooeTEZh.QpaVnPCjYW3AezgrZvZwmbwK33Zh506ZhpzhIbIbRxiC', 'CLIENT');
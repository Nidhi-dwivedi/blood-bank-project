CREATE DATABASE IF NOT EXISTS blood_bank;
USE blood_bank;

DROP TABLE IF EXISTS blood_requests;
DROP TABLE IF EXISTS blood_samples;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('hospital', 'receiver') NOT NULL,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  CONSTRAINT chk_receiver_blood_group
    CHECK (
      (role = 'receiver' AND blood_group IS NOT NULL)
      OR (role = 'hospital' AND blood_group IS NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE blood_samples (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  hospital_id INT UNSIGNED NOT NULL,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  CONSTRAINT fk_blood_samples_hospital
    FOREIGN KEY (hospital_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_blood_samples_quantity CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE blood_requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  blood_sample_id INT UNSIGNED NOT NULL,
  receiver_id INT UNSIGNED NOT NULL,
  hospital_id INT UNSIGNED NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  created_at DATETIME NULL,
  updated_at DATETIME NULL,
  CONSTRAINT fk_blood_requests_sample
    FOREIGN KEY (blood_sample_id) REFERENCES blood_samples(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_blood_requests_receiver
    FOREIGN KEY (receiver_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_blood_requests_hospital
    FOREIGN KEY (hospital_id) REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT uq_receiver_sample UNIQUE (blood_sample_id, receiver_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO users (name, email, password, role, blood_group, created_at, updated_at) VALUES
('City Care Hospital', 'hospital@example.com', '$2y$10$1My4/hMbsjKpazIVHSW4n.Li1VEDZCQ97tqP6VvzXPFJRs0P3WoMG', 'hospital', NULL, NOW(), NOW()),
('Asha Receiver', 'receiver@example.com', '$2y$10$1My4/hMbsjKpazIVHSW4n.Li1VEDZCQ97tqP6VvzXPFJRs0P3WoMG', 'receiver', 'A+', NOW(), NOW());

INSERT INTO blood_samples (hospital_id, blood_group, quantity, created_at, updated_at) VALUES
(1, 'A+', 6, NOW(), NOW()),
(1, 'O-', 3, NOW(), NOW());

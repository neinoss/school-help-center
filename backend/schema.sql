CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(32) NOT NULL,
  grade INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url VARCHAR(512),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE whatsapp_clicks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(32),
  grade INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subject VARCHAR(32),
  grade INT,
  title VARCHAR(191) NOT NULL,
  url VARCHAR(255),
  kind VARCHAR(32) NOT NULL,
  resource_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_favorite_resource (user_id, resource_id),
  UNIQUE KEY uniq_favorite_item (user_id, subject, grade, title, url, kind),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

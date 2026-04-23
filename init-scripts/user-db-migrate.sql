-- Migration script for user_db
-- Runs on MySQL container startup (only if DB already exists with old schema)
-- All statements are idempotent (IF NOT EXISTS / IF EXISTS)

USE user_db;

-- Add created_at if missing
SET @col_exists = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'created_at'
);
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE users ADD COLUMN created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'SELECT ''created_at already exists'' AS info'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- Add updated_at if missing
SET @col_exists2 = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'updated_at'
);
SET @sql2 = IF(@col_exists2 = 0,
  'ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'SELECT ''updated_at already exists'' AS info'
);
PREPARE stmt2 FROM @sql2; EXECUTE stmt2; DEALLOCATE PREPARE stmt2;

-- Add app_pin_hash if missing
SET @col_exists3 = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'app_pin_hash'
);
SET @sql3 = IF(@col_exists3 = 0,
  'ALTER TABLE users ADD COLUMN app_pin_hash VARCHAR(255) NULL',
  'SELECT ''app_pin_hash already exists'' AS info'
);
PREPARE stmt3 FROM @sql3; EXECUTE stmt3; DEALLOCATE PREPARE stmt3;

-- Add failed_login_attempts if missing
SET @col_exists4 = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'failed_login_attempts'
);
SET @sql4 = IF(@col_exists4 = 0,
  'ALTER TABLE users ADD COLUMN failed_login_attempts INT NOT NULL DEFAULT 0',
  'SELECT ''failed_login_attempts already exists'' AS info'
);
PREPARE stmt4 FROM @sql4; EXECUTE stmt4; DEALLOCATE PREPARE stmt4;

-- Add locked_until if missing
SET @col_exists5 = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'locked_until'
);
SET @sql5 = IF(@col_exists5 = 0,
  'ALTER TABLE users ADD COLUMN locked_until DATETIME NULL',
  'SELECT ''locked_until already exists'' AS info'
);
PREPARE stmt5 FROM @sql5; EXECUTE stmt5; DEALLOCATE PREPARE stmt5;

-- Add preevaluation_final_level if missing
SET @col_exists6 = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'preevaluation_final_level'
);
SET @sql6 = IF(@col_exists6 = 0,
  'ALTER TABLE users ADD COLUMN preevaluation_final_level VARCHAR(8) NULL',
  'SELECT ''preevaluation_final_level already exists'' AS info'
);
PREPARE stmt6 FROM @sql6; EXECUTE stmt6; DEALLOCATE PREPARE stmt6;

-- Add about if missing
SET @col_exists7 = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'about'
);
SET @sql7 = IF(@col_exists7 = 0,
  'ALTER TABLE users ADD COLUMN about VARCHAR(2000) NULL',
  'SELECT ''about already exists'' AS info'
);
PREPARE stmt7 FROM @sql7; EXECUTE stmt7; DEALLOCATE PREPARE stmt7;

-- Add avatar_url if missing
SET @col_exists8 = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'avatar_url'
);
SET @sql8 = IF(@col_exists8 = 0,
  'ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255) NULL',
  'SELECT ''avatar_url already exists'' AS info'
);
PREPARE stmt8 FROM @sql8; EXECUTE stmt8; DEALLOCATE PREPARE stmt8;

-- Add name column if missing (legacy NOT NULL)
SET @col_exists9 = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'user_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'name'
);
SET @sql9 = IF(@col_exists9 = 0,
  'ALTER TABLE users ADD COLUMN name VARCHAR(512) NOT NULL DEFAULT ''''',
  'SELECT ''name already exists'' AS info'
);
PREPARE stmt9 FROM @sql9; EXECUTE stmt9; DEALLOCATE PREPARE stmt9;

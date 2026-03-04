-- Migration script to update meetings table
-- Make application_id and assigned_to nullable to allow meetings without evaluator initially

-- Drop the UNIQUE constraint on application_id first (if it exists)
ALTER TABLE meetings DROP INDEX IF EXISTS application_id;

-- Modify application_id to be nullable
ALTER TABLE meetings MODIFY COLUMN application_id BIGINT NULL;

-- Modify assigned_to to be nullable
ALTER TABLE meetings MODIFY COLUMN assigned_to BIGINT NULL;

-- Re-add the unique constraint on application_id (only one meeting per application, but NULL is allowed)
-- Note: In MySQL, NULL values are not considered equal, so multiple NULLs are allowed
-- If you want to enforce uniqueness only for non-NULL values, you might need a unique index with a condition

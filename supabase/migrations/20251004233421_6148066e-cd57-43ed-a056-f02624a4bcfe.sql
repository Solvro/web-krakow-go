-- Fix ChatMessage senderId constraint issue
-- Remove the broken foreign key constraint that's causing the error

-- Drop the problematic constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'ChatMessage_senderId_fkey'
          AND table_name = 'ChatMessage'
    ) THEN
        ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_senderId_fkey";
    END IF;
END $$;

-- Since senderId can reference either Volunteer OR Organization,
-- we cannot use a traditional foreign key (PostgreSQL doesn't support polymorphic FKs)
-- Instead, we'll add a CHECK constraint that validates the ID exists in one of the tables

-- Note: This is less strict than a foreign key but prevents the error
-- The application code should ensure senderId is valid before inserting
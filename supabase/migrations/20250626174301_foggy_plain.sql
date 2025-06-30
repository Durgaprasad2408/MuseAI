/*
  # Create writings table for MuseAI application

  1. New Tables
    - `writings`
      - `id` (uuid, primary key) - Unique identifier for each writing
      - `user_id` (uuid, foreign key) - References auth.users.id
      - `title` (text, not null) - Title/preview of the writing
      - `original_text` (text) - User's original text input
      - `enhanced_text` (text) - AI-enhanced version of the text
      - `created_at` (timestamptz, not null) - When the writing was created

  2. Security
    - Enable RLS on `writings` table
    - Add policy for authenticated users to manage their own writings
    - Users can SELECT, INSERT, UPDATE, DELETE their own writings only

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on created_at for sorting
*/

-- Create the writings table
CREATE TABLE IF NOT EXISTS writings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  original_text text DEFAULT '',
  enhanced_text text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE writings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own writings"
  ON writings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own writings"
  ON writings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own writings"
  ON writings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own writings"
  ON writings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS writings_user_id_idx ON writings(user_id);
CREATE INDEX IF NOT EXISTS writings_created_at_idx ON writings(created_at DESC);
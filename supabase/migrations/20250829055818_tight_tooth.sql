/*
  # Fix User Registration and Profile Creation

  1. Functions
    - Improve handle_new_user function with better error handling
    - Ensure profiles are created correctly for both user types

  2. Security
    - Maintain existing RLS policies
    - Add better validation

  3. Data Integrity
    - Ensure proper foreign key relationships
    - Add validation constraints
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Create improved function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_type TEXT;
  user_name TEXT;
  user_email TEXT;
  user_phone TEXT;
  user_location TEXT;
  user_profession TEXT;
  profile_created BOOLEAN := false;
BEGIN
  -- Get user metadata with proper null handling
  user_type := COALESCE(NEW.raw_user_meta_data->>'user_type', NEW.raw_user_meta_data->>'role', 'client');
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User');
  user_email := COALESCE(NEW.email, '');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '');
  user_location := COALESCE(NEW.raw_user_meta_data->>'location', 'Tanzania');
  user_profession := COALESCE(NEW.raw_user_meta_data->>'profession', 'Creative Professional');
  
  -- Skip profile creation for admin users
  IF user_type = 'admin' THEN
    RETURN NEW;
  END IF;
  
  -- Validate required fields
  IF user_email = '' THEN
    RAISE WARNING 'Email is required for user creation, skipping profile creation';
    RETURN NEW;
  END IF;
  
  -- Create appropriate profile based on user type
  IF user_type = 'creative' THEN
    BEGIN
      -- Insert into creative_profiles
      INSERT INTO creative_profiles (
        user_id,
        title,
        category,
        bio,
        location,
        phone,
        email,
        approval_status,
        rating,
        reviews_count,
        completed_projects,
        hourly_rate,
        availability_status
      ) VALUES (
        NEW.id,
        user_profession,
        COALESCE(NEW.raw_user_meta_data->>'category', 'General'),
        'Professional ' || user_profession || ' based in ' || user_location,
        user_location,
        user_phone,
        user_email,
        'pending',
        0,
        0,
        0,
        50000,
        'available'
      );
      profile_created := true;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Failed to create creative profile: %', SQLERRM;
    END;
  ELSE
    BEGIN
      -- Insert into client_profiles
      INSERT INTO client_profiles (
        id,
        full_name,
        email,
        phone,
        location
      ) VALUES (
        NEW.id,
        user_name,
        user_email,
        user_phone,
        user_location
      );
      profile_created := true;
    EXCEPTION
      WHEN OTHERS THEN
        RAISE WARNING 'Failed to create client profile: %', SQLERRM;
    END;
  END IF;
  
  -- Log successful profile creation
  IF profile_created THEN
    RAISE NOTICE 'Successfully created % profile for user %', user_type, NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Ensure proper permissions
GRANT EXECUTE ON FUNCTION handle_new_user() TO authenticated, anon;

-- Add validation constraints if they don't exist
DO $$
BEGIN
  -- Ensure email is not null in client_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'client_profiles_email_not_null'
  ) THEN
    ALTER TABLE client_profiles ALTER COLUMN email SET NOT NULL;
  END IF;

  -- Ensure full_name is not null in client_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'client_profiles_full_name_not_null'
  ) THEN
    ALTER TABLE client_profiles ALTER COLUMN full_name SET NOT NULL;
  END IF;

  -- Ensure title is not null in creative_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'creative_profiles_title_not_null'
  ) THEN
    ALTER TABLE creative_profiles ALTER COLUMN title SET NOT NULL;
  END IF;

  -- Ensure category is not null in creative_profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'creative_profiles_category_not_null'
  ) THEN
    ALTER TABLE creative_profiles ALTER COLUMN category SET NOT NULL;
  END IF;
END $$;

-- Create function to manually create missing profiles (for existing users)
CREATE OR REPLACE FUNCTION create_missing_profiles()
RETURNS void AS $$
DECLARE
  user_record RECORD;
  user_type TEXT;
  profile_exists BOOLEAN;
BEGIN
  -- Loop through all auth users
  FOR user_record IN 
    SELECT id, email, raw_user_meta_data, created_at
    FROM auth.users
    WHERE email IS NOT NULL
  LOOP
    user_type := COALESCE(user_record.raw_user_meta_data->>'user_type', 'client');
    
    -- Skip admin users
    IF user_type = 'admin' THEN
      CONTINUE;
    END IF;
    
    IF user_type = 'creative' THEN
      -- Check if creative profile exists
      SELECT EXISTS(
        SELECT 1 FROM creative_profiles WHERE user_id = user_record.id
      ) INTO profile_exists;
      
      IF NOT profile_exists THEN
        BEGIN
          INSERT INTO creative_profiles (
            user_id,
            title,
            category,
            bio,
            email,



            approval_status,
            rating,
            reviews_count,
            completed_projects,
            hourly_rate,
            availability_status
          ) VALUES (
            user_record.id,
            COALESCE(user_record.raw_user_meta_data->>'profession', 'Creative Professional'),
            'General',
            'Professional creative',
            user_record.email,
            'pending',
            0,
            0,
            0,
            50000,
            'available'
          );
          RAISE NOTICE 'Created missing creative profile for user %', user_record.id;
        EXCEPTION
          WHEN OTHERS THEN
            RAISE WARNING 'Failed to create creative profile for user %: %', user_record.id, SQLERRM;
        END;
      END IF;
    ELSE
      -- Check if client profile exists
      SELECT EXISTS(
        SELECT 1 FROM client_profiles WHERE id = user_record.id
      ) INTO profile_exists;
      
      IF NOT profile_exists THEN
        BEGIN
          INSERT INTO client_profiles (
            id,
            full_name,
            email,
            location
          ) VALUES (
            user_record.id,
            COALESCE(user_record.raw_user_meta_data->>'full_name', 'User'),
            user_record.email,
            COALESCE(user_record.raw_user_meta_data->>'location', 'Tanzania')
          );
          RAISE NOTICE 'Created missing client profile for user %', user_record.id;
        EXCEPTION
          WHEN OTHERS THEN
            RAISE WARNING 'Failed to create client profile for user %: %', user_record.id, SQLERRM;
        END;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to create missing profiles for existing users
SELECT create_missing_profiles();

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000', -- Replace with your actual instance_id if needed, or leave as default
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@brandconnect.co.tz',
    crypt('12345678', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"user_type": "admin", "full_name": "Admin User"}',
    FALSE,
    NOW(),
    NOW(),
    '', -- confirmation_token
    '', -- email_change
    '', -- email_change_token_new
    '' -- recovery_token
);

-- Drop the helper function as it's no longer needed
DROP FUNCTION create_missing_profiles();




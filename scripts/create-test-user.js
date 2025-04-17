// Script to create a test user in Supabase Auth and profiles table
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Create a Supabase client with the service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function createTestUser() {
  try {
    // 1. Create a user in Supabase Auth
    console.log('Creating user in Supabase Auth...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'password',
      email_confirm: true, // Auto-confirm the email
    });

    if (authError) {
      throw authError;
    }

    console.log('User created in Auth:', authUser.user.id);

    // 2. Get or create the admin role
    console.log('Getting or creating admin role...');
    const { data: existingRoles, error: rolesError } = await supabase
      .from('roles')
      .select('*')
      .eq('name', 'admin');

    if (rolesError) {
      throw rolesError;
    }

    let roleId;
    if (existingRoles && existingRoles.length > 0) {
      roleId = existingRoles[0].id;
      console.log('Using existing admin role:', roleId);
    } else {
      const { data: newRole, error: newRoleError } = await supabase
        .from('roles')
        .insert({
          name: 'admin',
          description: 'Administrator with full access'
        })
        .select();

      if (newRoleError) {
        throw newRoleError;
      }

      roleId = newRole[0].id;
      console.log('Created new admin role:', roleId);
    }

    // 3. Create a profile for the user
    console.log('Creating user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authUser.user.id,
        email: 'admin@example.com',
        full_name: 'Admin User',
        role_id: roleId,
        password: 'password' // Note: In a real app, never store plain text passwords
      })
      .select();

    if (profileError) {
      throw profileError;
    }

    console.log('User profile created:', profile);
    console.log('\nTest user created successfully!');
    console.log('Email: admin@example.com');
    console.log('Password: password');

  } catch (error) {
    console.error('Error creating test user:', error);
  }
}

createTestUser();
import { getConnection, sql } from '../server/config/database.js';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    const pool = await getConnection();
    
    const adminEmail = 'admin@test.com';
    const adminPassword = 'admin123';
    const adminName = 'Test Admin';
    
    // Check if admin already exists
    const existingUser = await pool.request()
      .input('email', sql.NVarChar, adminEmail)
      .query('SELECT id FROM users WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const userId = sql.newGuid();

    // Create admin user
    await pool.request()
      .input('id', sql.UniqueIdentifier, userId)
      .input('email', sql.NVarChar, adminEmail)
      .input('password', sql.NVarChar, hashedPassword)
      .input('createdAt', sql.DateTime2, new Date())
      .input('updatedAt', sql.DateTime2, new Date())
      .query(`
        INSERT INTO users (id, email, password, created_at, updated_at)
        VALUES (@id, @email, @password, @createdAt, @updatedAt)
      `);

    // Create admin profile
    await pool.request()
      .input('id', sql.UniqueIdentifier, sql.newGuid())
      .input('userId', sql.UniqueIdentifier, userId)
      .input('fullName', sql.NVarChar, adminName)
      .input('email', sql.NVarChar, adminEmail)
      .input('role', sql.NVarChar, 'admin')
      .input('createdAt', sql.DateTime2, new Date())
      .input('updatedAt', sql.DateTime2, new Date())
      .query(`
        INSERT INTO profiles (id, user_id, full_name, email, role, created_at, updated_at)
        VALUES (@id, @userId, @fullName, @email, @role, @createdAt, @updatedAt)
      `);

    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
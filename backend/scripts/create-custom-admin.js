import pool from '../config/db.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Ensure .env is loaded from the backend directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function createCustomAdmin() {
    try {
        console.log('🔄 Creating custom admin account...');

        const email = 'admin@gmail.com';
        const password = '12345678';
        const name = 'Admin User';
        const role = 'admin';

        // Check if user already exists
        const checkQuery = 'SELECT id FROM credentials WHERE email = $1';
        const { rows } = await pool.query(checkQuery, [email]);

        // Hash password
        console.log('🔐 Hashing password...');
        const hash = bcryptjs.hashSync ? bcryptjs.hashSync(password, 10) : await bcryptjs.hash(password, 10);

        if (rows.length > 0) {
            console.log('📝 User already exists. Updating password and ensuring admin role...');
            const updateQuery = `
                UPDATE credentials 
                SET password_hash = $1, role = $2, is_verified = $3, name = $4
                WHERE email = $5
                RETURNING id, email, role
            `;
            const { rows: updatedRows } = await pool.query(updateQuery, [hash, role, true, name, email]);
            console.log('✅ Admin account updated successfully:', updatedRows[0]);
        } else {
            console.log('📥 Inserting new admin account...');
            const insertQuery = `
                INSERT INTO credentials (email, password_hash, role, is_verified, name)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, email, role
            `;
            const { rows: insertedRows } = await pool.query(insertQuery, [email, hash, role, true, name]);
            console.log('🎉 Admin account created successfully:', insertedRows[0]);
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating custom admin:', error);
        process.exit(1);
    }
}

createCustomAdmin();

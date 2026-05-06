import pool from './backend/config/db.js';

async function fetchUsers() {
  try {
    const recruiters = await pool.query("SELECT email, password, role FROM credentials WHERE role = 'recruiter' LIMIT 1");
    const seekers = await pool.query("SELECT email, password, role FROM credentials WHERE role = 'job_seeker' LIMIT 1");
    console.log('Recruiters:', recruiters.rows);
    console.log('Seekers:', seekers.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
fetchUsers();

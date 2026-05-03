import os
import uuid
import bcrypt
import random
from faker import Faker
from .db import get_db_connection
from .utils import generate_resume_pdf_base64
from psycopg2.extras import execute_values

fake = Faker(['en_IN', 'en_US'])

def seed_users(num_seekers=100, num_recruiters=35):
    conn = get_db_connection()
    cur = conn.cursor()
    
    password = "Demo123!"
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(10)).decode('utf-8')
    
    credentials = [] # (email, password_hash, role, is_verified, name)
    seekers = []
    recruiters = []
    
    print("Generating Job Seekers...")
    for _ in range(num_seekers):
        name = fake.name()
        email = f"{name.lower().replace(' ', '.')}@example.com"
        # ensure no duplicate email
        while any(x[0] == email for x in credentials):
            email = f"{name.lower().replace(' ', '.')}_{random.randint(1,9999)}@example.com"
            
        credentials.append((email, password_hash, 'job_seeker', True, name))
        seekers.append({'name': name, 'email': email})

    print("Generating Recruiters...")
    for _ in range(num_recruiters):
        name = fake.name()
        email = f"recruiter.{name.lower().replace(' ', '.')}@example.com"
        while any(x[0] == email for x in credentials):
            email = f"recruiter.{name.lower().replace(' ', '.')}_{random.randint(1,9999)}@example.com"
            
        credentials.append((email, password_hash, 'recruiter', True, name))
        recruiters.append({'name': name, 'email': email})

    # Insert into credentials
    print("Inserting credentials...")
    insert_query = """
        INSERT INTO credentials (email, password_hash, role, is_verified, name)
        VALUES %s RETURNING id, email, role, name
    """
    execute_values(cur, insert_query, credentials)
    inserted_users = cur.fetchall()
    
    # Save to file
    creds_path = os.path.join(os.path.dirname(__file__), '../../demo_credentials.txt')
    with open(creds_path, 'w') as f:
        f.write("Email | Password | Role | Name\n")
        f.write("-" * 60 + "\n")
        for u in inserted_users:
            f.write(f"{u[1]} | {password} | {u[2]} | {u[3]}\n")

    # Map inserted back
    inserted_seekers = [u for u in inserted_users if u[2] == 'job_seeker']
    inserted_recruiters = [u for u in inserted_users if u[2] == 'recruiter']
    
    # ----------------
    # CANDIDATES
    # ----------------
    print(f"Creating {len(inserted_seekers)} candidates...")
    skills_pool = ["React", "Node.js", "Python", "SQL", "Machine Learning", "AWS", "Docker", "UI/UX", "Java", "C++", "Kubernetes", "Redis", "MongoDB", "Data Science", "Project Management", "Agile", "Tableau", "Salesforce"]
    
    candidates_data = [] # for candidates table
    
    # Track candidate mappings for later
    seeker_user_to_candidate_id = {}
    
    candidate_inserts = []
    
    for user in inserted_seekers:
        user_id = user[0]
        email = user[1]
        name = user[3]
        
        phone = fake.phone_number()[:20]
        location = fake.city() + ", " + fake.country()
        skills = random.sample(skills_pool, k=random.randint(6, 12))
        is_fresher = random.choice([True, False])
        exp_years = 0 if is_fresher else random.randint(1, 15)
        
        job_title = fake.job() if not is_fresher else None
        company_name = fake.company() if not is_fresher else None
        degree = random.choice(["B.Tech", "MCA", "MBA", "B.Sc", "M.Sc", "B.E."])
        institution = fake.company() + " University"
        grad_year = fake.year()
        gpa = round(random.uniform(6.5, 9.8), 2)
        
        profile_desc = fake.paragraph(nb_sentences=3)
        git = f"https://github.com/{name.split()[0].lower()}"
        lin = f"https://linkedin.com/in/{name.replace(' ', '').lower()}"
        
        # We need to insert and get candidate ID back due to relationships
        cur.execute("""
            INSERT INTO candidates (
                user_id, name, email, phone_number, location, skills, 
                is_fresher, experience_years, job_title, company_name, 
                degree, institution, graduation_year, gpa,
                profile_description, github_url, linkedin_url
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            user_id, name, email, phone, location, skills,
            is_fresher, exp_years, job_title, company_name,
            degree, institution, grad_year, gpa,
            profile_desc, git, lin
        ))
        
        candidate_id = cur.fetchone()[0]
        seeker_user_to_candidate_id[user_id] = candidate_id
        
        # ----------------
        # RESUME GENERATION
        # ----------------
        resume_bs64 = generate_resume_pdf_base64(name, email, skills, profile_desc)
        resume_name = f"{name.replace(' ', '_')}_Resume.pdf"
        
        # Store in candidate_resumes
        cur.execute("""
            INSERT INTO candidate_resumes (candidate_id, resume_name, file_url, is_default)
            VALUES (%s, %s, %s, %s)
        """, (candidate_id, resume_name, f"data:application/pdf;base64,{resume_bs64}", True))
        
        # Update candidate table with resume
        cur.execute("""
            UPDATE candidates SET resume_pdf = %s, resume_url = %s WHERE id = %s
        """, (f"data:application/pdf;base64,{resume_bs64}", f"data:application/pdf;base64,{resume_bs64}", candidate_id))
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'seekers_map': seeker_user_to_candidate_id,
        'recruiters': [u[0] for u in inserted_recruiters]
    }

import random
import json
from datetime import datetime, timedelta
from faker import Faker
from .db import get_db_connection

fake = Faker()

def seed_applications_and_interviews(seekers_map, all_job_ids, companies_map):
    conn = get_db_connection()
    cur = conn.cursor()
    
    print("Simulating Job Applications, Auto-Shortlisting and Interviews...")
    
    # Invert companies map: job_id -> company_id
    job_to_company = {}
    for cid, jids in companies_map.items():
        for jid in jids:
            job_to_company[jid] = cid

    for user_id, candidate_id in seekers_map.items():
        # Candidate applies to 4-8 jobs
        num_apps = random.randint(4, 8)
        applied_jobs = random.sample(all_job_ids, k=num_apps)
        
        # Get Candidate Resume ID
        cur.execute("SELECT id, resume_name, file_url FROM candidate_resumes WHERE candidate_id = %s AND is_default = TRUE", (candidate_id,))
        resume_row = cur.fetchone()
        
        if not resume_row:
            continue
            
        res_id, res_name, res_url = resume_row
        
        for job_id in applied_jobs:
            c_id = job_to_company[job_id]
            
            # AI logic: 20% High (shortlisted), 50% Med, 30% Low
            rand_val = random.random()
            if rand_val < 0.2:
                match_score = random.randint(85, 99)
                shortlisted = True
                status = 'shortlisted'
            elif rand_val < 0.7:
                match_score = random.randint(50, 84)
                shortlisted = False
                status = 'applied'
            else:
                match_score = random.randint(10, 49)
                shortlisted = False
                status = 'rejected'
                
            applied_at = fake.date_time_between(start_date='-60d', end_date='now')
            
            explanation_json = json.dumps({
                "summary": f"Candidate has a match score of {match_score}% based on required skills.",
                "breakdown": {
                    "skillScore": match_score,
                    "experienceScore": random.randint(40, 90),
                    "seniorityScore": random.randint(50, 90),
                    "educationScore": 100,
                    "tfidfScore": match_score - random.randint(0, 5)
                },
                "matchedSkills": ["Python", "React", "SQL"] if match_score > 50 else ["SQL"],
                "missingSkills": ["AWS"] if match_score < 80 else []
            })
            
            # Insert Application
            cur.execute("""
                INSERT INTO job_applications (
                    job_id, candidate_id, company_id, resume_id, resume_name, resume_data,
                    status, applied_at, match_score, shortlisted_by_ai
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                job_id, candidate_id, c_id, res_id, res_name, res_url, 
                status, applied_at, match_score, shortlisted
            ))
            
            app_id = cur.fetchone()[0]
            
            # Application Sub-tables
            # 1. job_application_skills
            cur.execute("""
                INSERT INTO job_application_skills (application_id, skill_name, proficiency)
                VALUES (%s, %s, %s)
            """, (app_id, "Python", "Advanced"))
            
            # 2. job_application_profile_snapshot
            cur.execute("""
                INSERT INTO job_application_profile_snapshot (application_id, profile_data)
                VALUES (%s, %s)
            """, (app_id, json.dumps({"skills": ["Python", "React"], "experience_years": 5})))
            
            # Shortlists
            if shortlisted:
                cur.execute("""
                    INSERT INTO job_shortlists (job_id, candidate_id, match_score, rank, analysis_data)
                    VALUES (%s, %s, %s, %s, %s)
                """, (job_id, candidate_id, match_score, 1, explanation_json))
                
                # INTERVIEWS (For 50% of shortlisted candidates)
                if random.random() < 0.5:
                    cur.execute("SELECT created_by FROM companies WHERE id = %s", (c_id,))
                    recruiter_id = cur.fetchone()[0]
                    
                    interview_date = applied_at + timedelta(days=random.randint(2, 10))
                    
                    # Ensure timezone-aware scheduled_at if necessary
                    i_status = 'completed' if interview_date < datetime.now() else 'scheduled'
                    
                    cur.execute("""
                        INSERT INTO interviews (
                            job_id, application_id, candidate_id, recruiter_id,
                            interview_date, start_time, end_time, mode, status, 
                            meeting_link, channel_name, created_by, scheduled_at
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        job_id, app_id, candidate_id, recruiter_id,
                        interview_date.date(), "10:00", "11:00", "online", i_status,
                        "https://meet.example.com", f"channel_{app_id.replace('-', '')}", recruiter_id, interview_date
                    ))

    conn.commit()
    cur.close()
    conn.close()

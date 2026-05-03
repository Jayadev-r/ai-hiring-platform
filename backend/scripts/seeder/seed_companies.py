import random
from faker import Faker
from .db import get_db_connection

fake = Faker(['en_IN', 'en_US'])

def seed_companies_and_jobs(recruiter_ids):
    conn = get_db_connection()
    cur = conn.cursor()
    
    # ----------------
    # COMPANIES
    # ----------------
    print(f"Creating {len(recruiter_ids)} companies...")
    industries = ["Information Technology", "Financial Services", "Healthcare", "E-commerce", "Education Tech", "Logistics", "Marketing", "Consulting"]
    
    companies_map = {} # company_id -> [job_ids]
    
    for uid in recruiter_ids:
        c_name = fake.company()
        industry = random.choice(industries)
        web = f"https://www.{c_name.replace(' ', '').replace(',', '').lower()}.com"
        lin = f"https://linkedin.com/company/{c_name.replace(' ', '').replace(',', '').lower()}"
        desc = fake.paragraph(nb_sentences=4)
        loc = fake.city() + ", " + fake.country()
        
        cur.execute("""
            INSERT INTO companies (name, industry, website_url, linkedin_url, description, location, created_by, is_verified)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (c_name, industry, web, lin, desc, loc, uid, True))
        
        company_id = cur.fetchone()[0]
        companies_map[company_id] = []

    # ----------------
    # JOB POSTINGS
    # ----------------
    print("Creating Job Postings...")
    job_titles = [
        "Software Engineer", "Senior Frontend Developer", "Backend Developer", "Full Stack Engineer",
        "Data Scientist", "Machine Learning Engineer", "DevOps Specialist", "Product Manager",
        "Cloud Architect", "QA Engineer", "Mobile App Developer", "Systems Analyst"
    ]
    
    departments = ["Engineering", "Product", "Data", "IT", "Operations"]
    types = ["Full-time", "Contract", "Internship"]
    levels = ["Entry-level", "Mid-level", "Senior", "Director"]
    
    all_job_ids = []
    
    for c_id in companies_map.keys():
        num_jobs = random.randint(5, 10)
        
        for _ in range(num_jobs):
            title = random.choice(job_titles)
            dept = random.choice(departments)
            j_type = random.choice(types)
            exp = random.choice(levels)
            s_min = random.randint(40000, 80000)
            s_max = s_min + random.randint(20000, 60000)
            j_desc = fake.text(max_nb_chars=800)
            req_skills = ", ".join(fake.words(nb=5))
            
            # Post Job
            cur.execute("""
                INSERT INTO job_postings (
                    company_id, job_title, department, job_type, experience_level,
                    location, salary_min, salary_max, job_description, required_skills, status
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING job_id
            """, (
                c_id, title, dept, j_type, exp,
                fake.city(), s_min, s_max, j_desc, req_skills, 'Open'
            ))
            
            job_id = cur.fetchone()[0]
            companies_map[c_id].append(job_id)
            all_job_ids.append(job_id)
            
            # Insert Job Requirements
            for i in range(random.randint(3, 6)):
                cur.execute("""
                    INSERT INTO job_requirements (job_id, requirement_text, is_mandatory)
                    VALUES (%s, %s, %s)
                """, (job_id, fake.sentence(nb_words=6), random.choice([True, False])))
                
            # Insert Job Questions
            for i in range(random.randint(2, 5)):
                cur.execute("""
                    INSERT INTO job_questions (job_id, question_text, question_type, is_required)
                    VALUES (%s, %s, %s, %s)
                """, (job_id, fake.sentence(nb_words=8) + "?", "text", True))
                
            # Insert Job Expectations
            cur.execute("""
                INSERT INTO job_expectations (job_id, expected_experience_years, expected_education, notes)
                VALUES (%s, %s, %s, %s)
            """, (job_id, random.randint(1, 10), "Bachelor's Degree", fake.sentence()))

    conn.commit()
    cur.close()
    conn.close()
    
    return companies_map, all_job_ids

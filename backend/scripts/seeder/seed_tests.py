import random
import json
from datetime import datetime, timedelta
from faker import Faker
from .db import get_db_connection

fake = Faker()

def seed_tests(companies_map, all_job_ids, seekers_map, recruiters):
    conn = get_db_connection()
    cur = conn.cursor()
    print("Generating Tests and Coding Challenges...")
    
    # 1. Tests & Questions
    test_ids = []
    coding_test_ids = []
    
    # Generate some regular tests
    for rec_id in recruiters:
        # Give each recruiter 1-2 tests linked to their jobs
        num_tests = random.randint(1, 2)
        for _ in range(num_tests):
            job_id = random.choice(all_job_ids) # Approximate linkage
            start = datetime.now() - timedelta(days=random.randint(1, 10))
            end = datetime.now() + timedelta(days=random.randint(10, 30))
            
            cur.execute("""
                INSERT INTO tests (
                    job_id, recruiter_id, title, description, instructions,
                    start_date, start_time, end_date, end_time, duration_minutes, status, results_published
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                job_id, rec_id, fake.catch_phrase() + " Assessment", fake.paragraph(), fake.sentence(),
                start.date(), "09:00", end.date(), "17:00", 60, "published", False
            ))
            t_id = cur.fetchone()[0]
            test_ids.append(t_id)
            
            # Test Questions
            for q_idx in range(5):
                cur.execute("""
                    INSERT INTO test_questions (test_id, question_text, question_type, options, expected_answer, question_order)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    t_id, fake.sentence() + "?", "objective", 
                    json.dumps(["Option A", "Option B", "Option C", "Option D"]),
                    "Option A", q_idx
                ))
    
    # 2. Coding Tests & Cases
    for rec_id in recruiters:
        job_id = random.choice(all_job_ids)
        cur.execute("""
            INSERT INTO coding_tests (job_id, recruiter_id, title, description, time_limit, total_marks, status, results_published)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (job_id, rec_id, "Software Engineering Coding Challenge", fake.paragraph(), 90, 100, "published", False))
        
        ct_id = cur.fetchone()[0]
        coding_test_ids.append(ct_id)
        
        # Coding Questions
        for q_idx in range(2):
            cur.execute("""
                INSERT INTO coding_questions (test_id, title, problem_statement, input_format, output_format, constraints, marks, question_order)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                ct_id, f"Algorithm Challenge {q_idx+1}", fake.paragraph(), 
                "Array of integers", "Integer", "N <= 10^5", 50, q_idx
            ))
            cq_id = cur.fetchone()[0]
            
            # Test cases
            for tc_idx in range(3):
                cur.execute("""
                    INSERT INTO test_cases (question_id, input, expected_output, is_hidden)
                    VALUES (%s, %s, %s, %s)
                """, (cq_id, "1 2 3", "6", tc_idx > 0))

    # 3. Test Attempts & Submissions
    candidate_ids = list(seekers_map.values())
    
    for c_id in candidate_ids:
        # 30% of candidates attempt a normal test
        if random.random() < 0.3 and len(test_ids) > 0:
            t_id = random.choice(test_ids)
            
            # Must find an application ID ... grab a dummy one if needed or get one
            cur.execute("SELECT id FROM job_applications WHERE candidate_id = %s LIMIT 1", (c_id,))
            app_res = cur.fetchone()
            if app_res:
                app_id = app_res[0]
                cur.execute("""
                    INSERT INTO test_attempts (test_id, candidate_id, application_id, status, total_score, max_score, time_taken_seconds, submitted_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (t_id, c_id, app_id, "evaluated", random.randint(40, 100), 100, random.randint(1200, 3600), datetime.now()))
                
                attempt_id = cur.fetchone()[0]
                
                # Answers
                cur.execute("SELECT id FROM test_questions WHERE test_id = %s", (t_id,))
                q_ids = cur.fetchall()
                for (qid,) in q_ids:
                    cur.execute("""
                        INSERT INTO test_answers (attempt_id, question_id, candidate_answer, is_correct)
                        VALUES (%s, %s, %s, %s)
                    """, (attempt_id, "Option A", random.choice([True, False])))

        # 30% attempt a coding test
        if random.random() < 0.3 and len(coding_test_ids) > 0:
            ct_id = random.choice(coding_test_ids)
            cur.execute("SELECT id FROM coding_questions WHERE test_id = %s", (ct_id,))
            c_q_ids = cur.fetchall()
            
            for (cq_id,) in c_q_ids:
                cur.execute("""
                    INSERT INTO coding_submissions (candidate_id, question_id, test_id, source_code, language, score, max_score, test_cases_passed, total_test_cases, status)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    c_id, cq_id, ct_id, "def solve():\n    return 6", "python",
                    random.choice([0, 50]), 50, random.choice([0, 3]), 3, "evaluated"
                ))
                
    conn.commit()
    cur.close()
    conn.close()

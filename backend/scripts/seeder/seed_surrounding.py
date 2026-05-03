import random
import json
from faker import Faker
from .db import get_db_connection

fake = Faker()

def seed_surrounding_data(users_ids, seekers_map):
    conn = get_db_connection()
    cur = conn.cursor()
    print("Generating Notifications, Themes, Cover Letters, and Logs...")

    # 1. Themes & User Preferences
    # First ensure some themes exist
    cur.execute("SELECT id FROM themes LIMIT 1")
    if not cur.fetchone():
        print("Inserting default theme...")
        try:
            cur.execute("""
                INSERT INTO themes (name, colors, border_radius)
                VALUES ('Light Pro', '{"bg": "white", "text": "black"}', 8)
            """)
        except Exception as e:
            # Table might not strictly require all fields, fallback
            cur.execute('ROLLBACK')
            pass

    # 2. Notifications
    # Sending notifications to candidates
    candidate_user_ids = list(seekers_map.keys())
    
    for uid in candidate_user_ids:
        num_notifs = random.randint(2, 6)
        for _ in range(num_notifs):
            n_type = random.choice(['application_update', 'interview_scheduled', 'shortlisted'])
            
            if n_type == 'interview_scheduled':
                title = "Interview Scheduled!"
                msg = f"You have an upcoming interview for {fake.job()} position."
            elif n_type == 'shortlisted':
                title = "Application Shortlisted"
                msg = f"Good news! Your application at {fake.company()} was shortlisted."
            else:
                title = "Application Update"
                msg = "Your application status has been updated."

            # Note: The notifications table uses 'user_id' which references candidates(user_id) 
            # Or candidates.id? schema says references candidates(user_id)
            cur.execute("""
                INSERT INTO notifications (user_id, type, title, message, read, metadata)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (uid, n_type, title, msg, random.choice([True, False]), json.dumps({"source": "system"})))

    # 3. Admin Audit Logs
    try:
        cur.execute("SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_audit_log'")
        if cur.fetchone():
            for _ in range(20):
                cur.execute("""
                    INSERT INTO admin_audit_log (admin_id, action, entity_type, entity_id, details)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    random.choice(users_ids), 
                    random.choice(['USER_CREATED', 'JOB_DELETED', 'SYSTEM_UPDATE']),
                    'system', 
                    fake.uuid4(), 
                    json.dumps({"ip": fake.ipv4()})
                ))
    except Exception as e:
        cur.execute('ROLLBACK')
        print("Audit log table might not exist natively this way, skipping.")

    conn.commit()
    cur.close()
    conn.close()

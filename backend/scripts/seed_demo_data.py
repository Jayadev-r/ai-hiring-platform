import sys
import os

# Ensure the root dir is in path to import correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from seeder.seed_users import seed_users
from seeder.seed_companies import seed_companies_and_jobs
from seeder.seed_applications import seed_applications_and_interviews
from seeder.seed_tests import seed_tests
from seeder.seed_surrounding import seed_surrounding_data

def main():
    print("=========================================")
    print("🚀 Starting Complete Demo Data Generation")
    print("=========================================\n")
    
    # Phase 2-6: Users, Profiles, Resumes
    user_data = seed_users(num_seekers=70, num_recruiters=25)
    seekers_map = user_data['seekers_map'] # {user_id: candidate_id}
    recruiters = user_data['recruiters']   # [user_id, ...]
    
    # Phase 7-9: Companies, Jobs, Requirements
    companies_map, all_job_ids = seed_companies_and_jobs(recruiters)
    
    # Phase 10-13: Applications, AI logic, Shortlists, Interviews
    seed_applications_and_interviews(seekers_map, all_job_ids, companies_map)
    
    # Phase 14: Tests and Coding Challenges
    seed_tests(companies_map, all_job_ids, seekers_map, recruiters)
    
    # Phase 15-19: Notifications, Logs, Surrounding Metadata
    all_users = list(seekers_map.keys()) + recruiters
    seed_surrounding_data(all_users, seekers_map)
    
    print("\n✅ Demo data generation completed successfully!")
    print("📁 See demo_credentials.txt in the backend root for logins.")

if __name__ == "__main__":
    main()

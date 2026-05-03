import os
from dotenv import load_dotenv
import psycopg2

def get_db_connection():
    load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))
    db_url = os.environ.get("NEON_DATABASE_URL")
    if db_url and db_url.startswith("'") and db_url.endswith("'"):
        db_url = db_url[1:-1]
    return psycopg2.connect(db_url)

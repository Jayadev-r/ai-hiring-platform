import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
db_url = os.environ.get("NEON_DATABASE_URL")

conn = psycopg2.connect(db_url)
cur = conn.cursor()

cur.execute("""
    SELECT table_name, column_name, data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    ORDER BY table_name, ordinal_position;
""")
rows = cur.fetchall()

with open("schema_dump.txt", "w") as f:
    current_table = None
    for row in rows:
        table, col, dtype = row
        if table != current_table:
            f.write(f"\nTable: {table}\n")
            current_table = table
        f.write(f"  {col}: {dtype}\n")

cur.close()
conn.close()

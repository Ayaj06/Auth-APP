import psycopg2
from urllib.parse import urlparse
from .config import settings

def test_connection():
    print(f"Testing connection to: {settings.DATABASE_URL}")
    url = urlparse(settings.DATABASE_URL)
    dbname = url.path[1:]
    user = url.username
    password = url.password
    host = url.hostname
    port = url.port or 5432
    
    # Try connecting to postgres to check if server is running
    try:
        conn = psycopg2.connect(
            user=user,
            password=password,
            host=host,
            port=port,
            database="postgres"
        )
        conn.autocommit = True
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{dbname}';")
        exists = cur.fetchone()
        if not exists:
            print(f"Database '{dbname}' does not exist. Creating...")
            cur.execute(f"CREATE DATABASE {dbname};")
            print(f"Database '{dbname}' created successfully.")
        else:
            print(f"Database '{dbname}' already exists.")
            
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")
        print("Please make sure local PostgreSQL is running and credentials in backend/.env are correct.")
        return False

if __name__ == "__main__":
    test_connection()

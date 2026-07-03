from app.test_db_conn import test_connection
from app.seed import seed_db

if __name__ == "__main__":
    if test_connection():
        seed_db()
    else:
        print("Database preparation failed due to connection error.")

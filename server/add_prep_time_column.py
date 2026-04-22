from app import create_app, db
from sqlalchemy import text

app = create_app()
with app.app_context():
    try:
        # Using raw SQL to add the column safely
        db.session.execute(text("ALTER TABLE orders ADD COLUMN estimated_ready_at DATETIME"))
        db.session.commit()
        print("Successfully added estimated_ready_at column to orders table.")
    except Exception as e:
        db.session.rollback()
        # If it already exists, just ignore
        if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
            print("Column estimated_ready_at already exists.")
        else:
            print(f"Error adding column: {e}")

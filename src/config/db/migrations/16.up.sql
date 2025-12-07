CREATE TABLE
    forauthors (
        id SERIAL PRIMARY KEY,
        icon VARCHAR,
        title VARCHAR(10000),
        description TEXT,
        content TEXT,
        see INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW (),
        updated_at TIMESTAMP DEFAULT NOW ()
    );
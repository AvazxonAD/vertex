create table new_categories(
    id serial primary key not null,
    name VARCHAR(10000) NOT NULL, 
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    is_active BOOLEAN DEFAULT TRUE
)
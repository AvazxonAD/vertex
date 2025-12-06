create table news_tags(
    id serial primary key not null,
    
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    is_active BOOLEAN DEFAULT TRUE
)
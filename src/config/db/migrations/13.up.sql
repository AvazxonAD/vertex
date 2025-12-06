create table storage(
    id serial primary key not null,
    file TEXT,  
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    isdeleted BOOLEAN DEFAULT false
);

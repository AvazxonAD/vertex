create table users(
    id serial primary key not null, 
    email varchar not null, 
    password varchar(500) not null, 
    username varchar(100) not null, 
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz default null
);
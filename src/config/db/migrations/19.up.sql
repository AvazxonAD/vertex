create table authors(
    id serial primary key,
    name varchar(255) not null,
    bio text,
    academic_link text,
    google_scholar_link text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp
)
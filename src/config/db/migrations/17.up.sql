create table volume(
    id serial primary key,
    "order" integer not null,
    year integer not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp
)
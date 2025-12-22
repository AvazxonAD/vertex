create table issue(
    id serial primary key,
    volume_id integer not null,
    quater integer not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp
)
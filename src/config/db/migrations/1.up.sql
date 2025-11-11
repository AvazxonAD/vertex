create table template(
    id serial primary key not null, 
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz default null
);

create table jurnals(
    id serial primary key not null, 
    name varchar(1000) not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz default null
);
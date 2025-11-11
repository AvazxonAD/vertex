create table fields(
    id serial primary key not null, 
    name varchar(1000) not null, 
    jurnal_id integer references jurnals(id) not null,   
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    deleted_at timestamptz default null
);
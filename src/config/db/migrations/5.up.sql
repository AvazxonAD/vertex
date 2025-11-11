create table
    articles (
        id serial primary key not null,
        title varchar not null,
        issn varchar not null,
        color varchar not null,
        image varchar not null,
        created_at timestamptz default now (),
        updated_at timestamptz default now (),
        deleted_at timestamptz default null
    );
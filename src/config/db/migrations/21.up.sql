create table features(
    id serial primary key,
    jurnal_id integer not null references jurnals(id),    
    issue_id integer not null references issue(id),
    article_id integer not null references articles(id),
    title varchar(500) not null,
    description text,
    body text,
    dru_link text, 
    pdf_file text,
    received DATE,
    revision_received DATE,
    accepted DATE,
    published DATE,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp
);

create table feature_authors(
    id serial primary key,
    feature_id integer not null references features(id),
    author_id integer not null references authors(id),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    deleted_at timestamp
);

alter table news_tags add column news_id integer references news(id);
alter table news_tags add column tag_id integer;
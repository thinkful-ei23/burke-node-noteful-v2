--psql -U dev -f ./db/noteful-app.1.sql noteful-app

DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;

CREATE TABLE folders (
    id serial PRIMARY KEY,
    name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

CREATE TABLE notes(
  id serial PRIMARY KEY,
  title text NOT NULL, 
  content text,
  created timestamp DEFAULT current_timestamp,
  folder_id int REFERENCES folders(id) ON DELETE SET NULL
);

-- why is it called notes_id_seq (ask a TA)?
ALTER SEQUENCE notes_id_seq RESTART WITH 1000;

CREATE TABLE tags(
  id serial PRIMARY KEY,
  name text NOT NULL UNIQUE 
);

CREATE TABLE notes_tags (
  note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);


INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

INSERT INTO notes
  (title, content, folder_id) VALUES
    ('5 life lessons learned from cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit', 100),
    ('What the government doesn''t want you to know about cats', 'Posuere sollicitudin aliquam ultrices sagittis orci', 101),
    ('The most boring article about cats you''ll ever read', 'Lorem ipsum dolor sit amet, conse', 102),
    ('potatoes', 'Lorem ipsum dolor sit amet, conse', 102)
    RETURNING id, title, content, created;

INSERT INTO tags
  (name) VALUES
  ('June'), ('July'), ('August')
  RETURNING id, name;

INSERT INTO notes_tags 
  (note_id, tag_id) VALUES
  (1000, 1), (1000, 2), (1001, 2), (1002, 3)
  RETURNING note_id, tag_id;


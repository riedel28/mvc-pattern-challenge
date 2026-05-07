DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS authors;

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  authorId TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  teaser TEXT,
  image TEXT NOT NULL
);

INSERT INTO posts (title, content, authorId, createdAt, image) VALUES
  ('First post', 'First content', 1, 1743120000, 'colorful-umbrella.jpg'),
  ('Second post', 'More content', 2, 1745452800, 'flowers.jpg');

CREATE TABLE authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  createdAt INTEGER NOT NULL
);

INSERT INTO authors (firstName, lastName, createdAt) VALUES
  ('John', 'Doe', 1743120000),
  ('Jane', 'Doe', 1745452800);
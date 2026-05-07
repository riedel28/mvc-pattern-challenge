DROP TABLE IF EXISTS posts;

CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  createdAt INTEGER NOT NULL,
  teaser TEXT,
  image TEXT NOT NULL
);

INSERT INTO posts (title, content, author, createdAt, image) VALUES
  ('First post', 'First content', 'John Doe', 1743120000, 'colorful-umbrella.jpg'),
  ('Second post', 'More content', 'Jane Doe', 1745452800, 'flowers.jpg');
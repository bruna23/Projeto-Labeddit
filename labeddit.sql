-- Active: 1678144304102@@127.0.0.1@3306

CREATE TABLE users (
     id TEXT PRIMARY KEY DEFAULT NULL,
     name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     role TEXT DEFAULT NULL,
     created_at TEXT DEFAULT (DATETIME('now')) NOT NULL
);

INSERT INTO users (id, name, email, password, role)
VALUES
("u001", "Bianca", "bianca_29@gmail.com", "Bianca56_9*0", "NORMAL"),
("u002", "Bruna", "bruna_23@gmail.com", "Br7890_*s2", "ADMIN"),
("u003", "William", "will_kennedy@gmail.com", "will-linkedin90", "NORMAL"),
("u004", "Thiago", "thiagoricardo@gmail.com", "thiagor-78.0", "NORMAL"),
("u005", "Giovanna", "gio912@gmail.com", "gio/*908i0u", "NORMAL"),
("u006", "Mônica", "monica_bispo@gmail.com", "monica-valerio814", "NORMAL"),
("u007", "Paulo", "paulovieira_358@gmail.com", "paulo*ghu54", "NORMAL"),
("u008", "Alan", "targ_alan@gmail.com", "alan_targ987", "NORMAL"),
("u009", "Gleiciane", "glelima3@gmail.com", "gle_lima@wer", "NORMAL"),
("u010", "Sandro", "sandro90ir@gmail.com", "sandro8*ir56", "NORMAL");

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE posts (
    id TEXT UNIQUE NOT NULL,
    creator_id TEXT NOT NULL ,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at  TEXT DEFAULT (DATETIME('now')) NOT NULL,
    updated_at TEXT DEFAULT (DATETIME('now')) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
);

INSERT INTO posts (id, creator_id, content, likes, dislikes)
VALUES
("c001", "u001", "video de bicicleta", 89, 5),
("c002", "u002", "foto pessoal", 310, 4),
("c003", "u003", "video de memes", 125, 2),
("c004", "u004", "video de códigos", 65, 5),
("c005", "u005", "reels de viagens", 210, 9),
("c006", "u006", "video de receita", 75, 3),
("c007", "u007", "reels de futebol", 99, 8),
("c008", "u008", "reels de carro", 155, 7),
("c009", "u009", "foto de viagens", 305, 1),
("c010", "u010", "video de futebol", 87, 9);

SELECT * FROM posts;

DROP TABLE posts;

CREATE TABLE comments (
  id TEXT PRIMARY KEY UNIQUE NOT NULL,
  post_id TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT(0),
  dislikes INTEGER DEFAULT(0),
  created_at TEXT DEFAULT(DATETIME()),
  updated_at TEXT DEFAULT(DATETIME()),
  creator_id TEXT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO comments (id, post_id, content, creator_id) VALUES
  ("c001", "p01", "Como você pedala bem!!", "u001"),
  ("c002", "p02", "Que lindaa, amei a foto!", "u002"),
  ("c003", "p03", "Achei engraçado! kkkkk", "u003"),
  ("c004", "p04", "Olha essa dica pra nós devs! :)", "u004"),
  ("c005", "p05", "Olha esse lugar incrível!!", "u005"),
  ("c006", "p06", "Veja essa receitinhaa", "u006"),
  ("c007", "p07", "Vê esse reels do golaço do Palmeiras!!!", "u007"),
  ("c008", "p08", "Olha essa nave, quero um!!", "u008"),
  ("c009", "p09", "Olha nossa foto nessa viagem!", "u009"),
  ("c010", "p10", "Olha esse vídeo da seleção!", "u010");

  SELECT * FROM comments;

  DROP TABLE comments;

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (post_id) REFERENCES posts (id)
);

INSERT INTO likes_dislikes(user_id, post_id, like)
VALUES
("u001", "p01", 89),
("u002", "p02", 310),
("u003", "p03", 125),
("u004", "p04", 65),
("u005", "p05", 210),
("u006", "p06", 75),
("u007", "p07", 99),
("u008", "p08", 155),
("u009", "p09", 305),
("u010", "p10", 87);

SELECT * FROM likes_dislikes;

DROP TABLE likes_dislikes;


CREATE TABLE likes_dislikes_posts (
  user_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE (user_id, post_id)
);

CREATE TABLE likes_dislikes_comments (
  user_id TEXT NOT NULL,
  comment_id TEXT NOT NULL,
  post_id TEXT NOT NULL,
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  UNIQUE (user_id, comment_id, post_id)
);















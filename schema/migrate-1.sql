CREATE TABLE  Artists
( id char(25),
name char(100),
followers integer,
popularity integer,
image char(100),
PRIMARY KEY(id));

CREATE TABLE PriceHistory
( id char(25),
time timestamp,
price decimal(2),
PRIMARY KEY(id, time));

CREATE TABLE Users
( id bigint,
  token char(200),
PRIMARY KEY(id));

# stocks_backend

## Setup

### Node setup
Node v5+ required. Easiest to install using brew.
Run ```npm install``` to install packages.
After packages are installed, run ```npm run dev``` to start the server.

### Environment variable setup
Create a `.env` file with the correct variables set in the root directory of the project. Ask in the group for the contents.

### Database setup
1. Install Postgres.app: https://postgresapp.com/
2. Run ```createdb stocksify``` on your terminal. If the `createdb` command does not work, check that Postgres.app is running and restart your terminal.
3. Open the Postgres client. You should see database "stocksify" under server "Postgres 10".
4. Run ```psql -U postgres -d stocksify```.
5. Execute the below table creation commands:

```
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
PRIMARY KEY(id, timestamp));

CREATE TABLE Users
( id bigint,
  token char(200),
PRIMARY KEY(id)); 
```

6. To check that your schema was saved, run ```\dt+ pricehistory``` and ```\dt+ artists```. You should see the schemas reflected in the terminal.

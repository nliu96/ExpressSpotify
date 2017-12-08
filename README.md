# stocks_backend
Re-creating the database on your local computer:
1. Install Postgres.app: https://postgresapp.com/
2. Run "createdb stocksify" on your terminal.
3. Open the Postgres client. You should see database "stocksify" under server "Postgres 10".
4. Run psql -U postgres -d stocksify.
5. Execute the below table creation commands:

CREATE TABLE  Artists
( id char(25), 
name char(100), 
followers integer, 
popularity integer,
image char(100));

CREATE TABLE PriceHistory
( id char(25),
time timestamp, 
price decimal(2));

6. To check that your schema was saved. run \dt+ pricehistory and \dt+ artists. You should see the schemas reflected in the terminal.

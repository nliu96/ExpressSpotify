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
4. Execute ```createdb stocksify```.
5. Execute ```psql -U postgres -d stocksify -a -f schema/migrate-1.sql```.
6. To check that your schema was saved, run ```psql -U postgres -d stocksify```. ```\dt+ pricehistory```, and ```\dt+ artists```. You should see the schemas reflected in the terminal.

### Register/Login Diagram
Observe the mediocre diagram below. "LL" stands for long-lived tokens, which last ~60 days. "req" stands for request.
![alt text](jdevanathan3.github.io/login_registration.png)

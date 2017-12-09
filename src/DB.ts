import * as pg from 'pg'
import * as pgp from 'pg-promise'

const isDevEnvironment = process.env.NODE_ENV !== 'production'

pg.defaults.ssl = !isDevEnvironment

const conString = isDevEnvironment ?
  'postgres://localhost/stocksify' :
  process.env.DATABASE_URL

// TODO; include DATABASE_URL in env


class DB {
  private db

  constructor () {
    this.db = pgp()(conString)
  }

  private query(query, params): Promise<any> {
    return this.db.any(query, params)
  }

  private queryOnce(query, params): Promise<any> {
    return this.db.one(query, params)
  }

  public insertUser(id, token): Promise<number> {
    return this.queryOnce(`
      INSERT INTO USERS (id, token) VALUES ($1,$2)
      ON CONFLICT(id)
      DO UPDATE SET token=$2
      RETURNING id;`
    , [id, token])
  }
}
export default new DB()


import type {Knex} from "knex";
import dotenv from "dotenv";

dotenv.config();

const knexConfig: {[key: string]: Knex.Config} = {
  development: {
    client: "mysql",
    connection: {
      host: process.env.DB_HOST,
      port: (process.env.DB_PORT || 3306) as number,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: __dirname + "/src/migrations",
    },
  },
};

export default knexConfig;

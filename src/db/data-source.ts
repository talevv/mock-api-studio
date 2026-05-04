
import { DataSource } from "typeorm";
import { Endpoint } from "../models/endpoint.model";
import { getDbPath } from "../helpers/helpers";


export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: getDbPath(),
  synchronize: false,
  logging: false,
  entities: [Endpoint],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  subscribers: [],
});
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

class Db {
  constructor(options) {
    this.pool = new Pool({
      user: options.user,
      password: options.password,
      port: options.port,
      host: options.host,
      database: options.database,
    });
  }

  static getInstance() {
    if (!Db.instance) {
      const options = {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
      };
      Db.instance = new Db(options);
    }
    return Db.instance;
  }

  getPool() {
    return this.pool;
  }

  async query(query, params) {
    try {
      const results = await this.pool.query(query, params);
      return results.rows;
    } catch (error) {
      console.error(`Error on query: ${error.message}`.red);
      throw error;
    }
  }

  async transaction(callback) {
    const client = await this.pool.connect();
    let isTransactionSuccessfully = false;
    try {
      console.info("Starting transaction...");
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      isTransactionSuccessfully = true;
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`Error on transaction: ${error.message}`.red);
      throw error;
    } finally {
      client.release();
      if (isTransactionSuccessfully) {
        console.info("Transaction committed successfully!");
      } else {
        console.info("Transaction was rolled back!".red);
      }
    }
  }

  static async connectDB() {
    const db = Db.getInstance();
    const dbPool = db.getPool();
    console.log("Connect db".blue);
    await db.query(`--sql
            CREATE TABLE IF NOT EXISTS "migrations"
            (
                "id"        SERIAL PRIMARY KEY NOT NULL,
                "version"   SERIAL  NOT NULL,
                "file_name" VARCHAR NOT NULL UNIQUE
            );
        `);

    const folder_path = path.join(__dirname, "./migrations");

    const files = fs.readdirSync(folder_path);

    const sql_files = files.filter((file) => file.endsWith(".sql"));

    const all_files = sql_files;

    const versions = await db.query(`SELECT * FROM migrations ORDER BY id`);

    const sortedFiles = all_files.sort((a, b) => {
      const numA = parseInt(a.split(".")[0], 10);
      const numB = parseInt(b.split(".")[0], 10);
      return numA - numB;
    });

    let filePath;
    for (let file of sortedFiles) {
      const version = versions.find((item) => item.file_name === file);
      if (!version) {
        const client = await dbPool.connect();

        try {
          await client.query("BEGIN");
          console.info(`runing start migration : => ${file}`.bgYellow);
          await client.query(`INSERT INTO migrations(file_name) VALUES($1)`, [file]);
          filePath = `${folder_path}/${file}`;

          const sqlQuery = await fs.promises.readFile(filePath, "utf-8");

          await client.query(sqlQuery);
          console.info(`runing success migration : => ${file}`.bgRed);

          await client.query("COMMIT");
        } catch (error) {
          await client.query("ROLLBACK");
          throw new Error(`${file} ${error} filePath`);
        } finally {
          client.release();
        }
      }
    }

    return { db, dbPool };
  }
}

const db = Db.getInstance();
const pool = Db.getInstance().getPool();

module.exports = {
  Db,
  db,
  pool,
};

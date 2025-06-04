import { Client } from "pg";
import { config } from "dotenv";
config(); // Load environment variables from .env file

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: "postgres", // Default database for initial connection
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT
});

const databaseName = process.env.PGDATABASE;

async function createDatabaseIfNotExists() {
  try {
    await client.connect().then(() => {
      console.log("Connected to PostgreSQL server");
    });
    const res = await client.query(
      "SELECT datname FROM pg_database where datname = $1",
      [databaseName]
    );
    // console.log(res.rowCount);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${databaseName}`);
      console.log(`Database ${databaseName} created successfully`);
    } else {
      console.log(`Database ${databaseName} already exists`);
    }
  } catch (error) {
    console.error("Error connecting to PostgreSQL server:", error);
  } finally {
    await client.end();
  }
}

export default createDatabaseIfNotExists;

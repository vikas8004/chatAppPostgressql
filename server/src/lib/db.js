import { Pool } from "pg";
import { config } from "dotenv";
config(); // Load environment variables from .env file

const pool = new Pool();

export default pool;
// This code sets up a connection pool to a PostgreSQL database using the 'pg' library.

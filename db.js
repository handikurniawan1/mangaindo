import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'manga_db',
  password: 'handi',
  port: 5432,
});

export default pool;
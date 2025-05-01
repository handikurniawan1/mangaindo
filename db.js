// import pkg from 'pg';
// const { Pool } = pkg;

// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'manga_db',
//   password: 'handi',
//   port: 5432,
// });

// export default pool;

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // biar Railway aman SSL-nya
});

export default pool;

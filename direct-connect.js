import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sundayschool',
  password: 'postgres',
  port: 5431,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Database connection successful!');
    console.log('Current time from database:', res.rows[0].now);
  }
  pool.end();
});

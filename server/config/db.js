import Pool from 'pg-pool';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'speaklite',
  password: 'root',
  port: 5432,
  idleTimeoutMillis: 30000,
});

export default pool;

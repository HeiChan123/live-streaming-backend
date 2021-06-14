import { Pool } from 'pg';
import env from '../../../../env';
process.env.PGOPTIONS="-c search_path=public"
const databaseConfig = { connectionString: env.database_url };
const pool = new Pool(databaseConfig);

export default pool;

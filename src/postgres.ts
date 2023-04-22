import { Client } from 'pg';
export const postgres = async () => {
  const client = new Client({
    host: 'localhost',
    database: 'test',
    port: 5432,
    user: 'postgres',
    password: 'root',
  });
  await client.connect();
  return await client;
};

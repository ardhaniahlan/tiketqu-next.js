import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

console.log("Cek URL Database:", process.env.DATABASE_URL ? "ADA ISINYA ✅" : "KOSONG/UNDEFINED ❌");

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
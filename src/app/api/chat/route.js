// src/app/api/chat/route.js
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT || 5432),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export async function POST(req) {
  const { message } = await req.json();

  try {
    const query = 'SELECT response FROM responses WHERE query = $1 LIMIT 1';
    const result = await pool.query(query, [message]);

    const reply = result.rows[0]?.response || 'Sorry, I do not understand that.';
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Database error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

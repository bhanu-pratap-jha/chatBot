// src/app/api/chat/route.js
import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req) {
  const { message } = await req.json();

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'chatbot_db',
    password: 'radhekrishn',
    port: 5432,
  });

  try {
    await client.connect();
    const query = 'SELECT response FROM responses WHERE query = $1 LIMIT 1';
    const result = await client.query(query, [message]);

    if (result.rows.length === 0) {
      return NextResponse.json({ reply: 'Sorry, I do not understand that.' });
    }

    const reply = result.rows[0].response;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.end();
  }
}

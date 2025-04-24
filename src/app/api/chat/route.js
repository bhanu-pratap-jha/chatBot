// src/app/api/chat/route.js
import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let conn;

async function getCollection() {
  if (!conn) conn = await client.connect();
  return conn.db('chatbot').collection('responses');
}

export async function POST(req) {
  const { message } = await req.json();

  try {
    const collection = await getCollection();
    const doc = await collection.findOne({ query: message });

    const reply = doc?.response || 'Sorry, I do not understand that.';
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('MongoDB error:', err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

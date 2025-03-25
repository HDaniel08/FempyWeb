import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Adatbázis kapcsolat beállítása
const dbConfig = {
    host: 'localhost',
    user: 'fempy_dev',
    password: 'fempy_123',
    database: 'fempy_dev',
  };
export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT sorszam as id, megnevezes as name FROM poziciofa ORDER BY sorszam ASC');
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Adatbázis hiba:', error);
    return NextResponse.json({ error: 'Adatok lekérdezése sikertelen' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'fempy_dev',
    password: 'fempy_123',
    database: 'fempy_dev',
};

// Alkalmazottak lekérdezése
export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, vezeteknev, keresztnev, email,password,szuletesnap,pozicio, poziciofa.megnevezes as pozicio_nev FROM users join poziciofa on poziciofa.sorszam=users.pozicio ORDER BY id;');
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Hiba az alkalmazottak lekérésekor:', error);
    return NextResponse.json({ error: 'Adatok lekérdezése sikertelen' }, { status: 500 });
  }
}

// Alkalmazott hozzáadása
export async function POST(request) {
  const { vezeteknev, keresztnev, email, pozicio } = await request.json();
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('INSERT INTO users (vezeteknev, keresztnev, email, pozicio) VALUES (?, ?, ?, ?)', [vezeteknev, keresztnev, email, pozicio]);
    await connection.end();
    return NextResponse.json({ message: 'Alkalmazott hozzáadva' }, { status: 201 });
  } catch (error) {
    console.error('Hiba az alkalmazott hozzáadásakor:', error);
    return NextResponse.json({ error: 'Hiba az alkalmazott hozzáadása során' }, { status: 500 });
  }
}

// Alkalmazott törlése
export async function DELETE(request) {
  const { id } = await request.json();
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    await connection.end();
    return NextResponse.json({ message: 'Alkalmazott törölve' });
  } catch (error) {
    console.error('Hiba az alkalmazott törlésénél:', error);
    return NextResponse.json({ error: 'Hiba az alkalmazott törlésekor' }, { status: 500 });
  }
}

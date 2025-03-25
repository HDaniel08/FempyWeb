import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'fempy_dev',
    password: 'fempy_123',
    database: 'fempy_dev',
};

// Pozíciók lekérdezése
export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT sorszam, megnevezes, felettes FROM poziciofa ORDER BY sorszam');
    await connection.end();
   
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Hiba a pozíciók lekérésekor:', error);
    return NextResponse.json({ error: 'Adatok lekérdezése sikertelen' }, { status: 500 });
  }
}

// Pozíció hozzáadása
export async function POST(request) {
  const { megnevezes, felettes } = await request.json();
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('INSERT INTO poziciofa (megnevezes, felettes) VALUES (?, ?)', [megnevezes, felettes]);
    
    await connection.end();
 
    return NextResponse.json({ message: 'Pozíció hozzáadva' }, { status: 201 });
  } catch (error) {
    console.error('Hiba a pozíció hozzáadásakor:', error);
    return NextResponse.json({ error: 'Hiba a pozíció hozzáadása során' }, { status: 500 });
  }
}

// Pozíció törlése
export async function DELETE(request) {
  const { sorszam } = await request.json();
  try {
    const connection = await mysql.createConnection(dbConfig);
    // Törlés előtt le kell kezelni az alárendelt pozíciók törlését is
    await connection.execute('DELETE FROM poziciofa WHERE sorszam = ?', [sorszam]);
    await connection.end();
    return NextResponse.json({ message: 'Pozíció törölve' });
  } catch (error) {
    console.error('Hiba a pozíció törlésénél:', error);
    return NextResponse.json({ error: 'Hiba a pozíció törlésekor' }, { status: 500 });
  }
}

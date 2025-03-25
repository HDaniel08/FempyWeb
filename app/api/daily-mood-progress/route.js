import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Adatbázis kapcsolat beállítása
const dbConfig = {
  host: 'localhost',
  user: 'fempy_dev',
  password: 'fempy_123',
  database: 'fempy_dev',
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const positions = searchParams.get('positions');

    const connection = await mysql.createConnection(dbConfig);
   
    const [rows] = await connection.execute(`
      SELECT x.total, y.completed FROM 
      (SELECT count(*)as total from users 
      ${positions ? `WHERE pozicio IN (${positions}))` : ')'} 
      as x, 
      (SELECT count(*)as completed 
      FROM napi_kedv 
      JOIN users ON napi_kedv.user=users.id 
      WHERE nap=CURRENT_DATE() 
       ${positions ? `AND users.pozicio IN (${positions}))` : ')'}
    as y;`);

    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Adatbázis hiba:', error);
    return NextResponse.json({ error: 'Adatok lekérdezése sikertelen' }, { status: 500 });
  }
}

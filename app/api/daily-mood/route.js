import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Adatbázis kapcsolat beállítása
const dbConfig = {
  host: 'localhost',
  user: 'fempy_dev',
  password: 'fempy_123',
  database: 'fempy_dev',
};

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function initData(){
  const datesArray = [];

  // A mai nap dátuma
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 4)
  // Feltöltjük a tömböt a mai nappal és az előző 4 nappal
  for (let i = 0; i < 5; i++) {
    datesArray.push({
      nap: formatDate(currentDate),
      kedv: '0'
    });
    // Módosítjuk a dátumot az előző napra
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return datesArray;
}




export async function GET(request) {
  const data=initData();
  const { searchParams } = new URL(request.url);
  const positions = searchParams.get('positions');
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT DATE_FORMAT(napi_kedv.nap, "%Y-%m-%d") as nap,
       AVG(kedv) as kedv 
       FROM napi_kedv 
       JOIN users ON napi_kedv.user=users.id
       ${positions ? `WHERE users.pozicio IN (${positions})` : ''} 
       GROUP BY napi_kedv.nap HAVING napi_kedv.nap >= DATE(NOW()) + INTERVAL -4 DAY;`);
    await connection.end();

    data.forEach(dateObj => {
      // Megkeressük, hogy az adatbázis tömbben van-e olyan elem, aminek ugyanaz a napja
      const dbEntry = rows.find(dbObj => dbObj.nap === dateObj.nap);
      if (dbEntry) {
        // Ha találunk egyező napot, kicseréljük a kedv értékét
        dateObj.kedv = dbEntry.kedv;
      }
    });


   
    return NextResponse.json(data);
  } catch (error) {
    console.error('Adatbázis hiba:', error);
    return NextResponse.json({ error: 'Adatok lekérdezése sikertelen' }, { status: 500 });
  }
}

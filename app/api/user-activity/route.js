import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "localhost",
  user: "fempy_dev",
  password: "fempy_123",
  database: "fempy_dev",
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      SELECT 
    users.pozicio,
    poziciofa.megnevezes as pozicio_nev,
    DATE_FORMAT(activity.date, "%Y-%m-%d") AS nap,
    COUNT(activity.user) / COUNT(DISTINCT DATE(activity.date)) AS atlagos_hasznalat
FROM activity
LEFT JOIN users ON activity.user = users.id
LEFT JOIN poziciofa ON users.pozicio=poziciofa.sorszam
WHERE activity.date >= DATE(NOW()) - INTERVAL 7 DAY
GROUP BY users.pozicio, DATE(activity.date)
ORDER BY nap, users.pozicio;

    `;
    const [rows] = await connection.execute(query);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Adatbázis hiba:", error);
    return NextResponse.json(
      { error: "Adatok lekérdezése sikertelen" },
      { status: 500 }
    );
  }
}

"use client";

import React, { useState, useEffect } from "react";
import "./DailyMoodCard.css";
import DailyMoodChart from "./charts/DailyMoodChart";
import DailyMoodProgressionChart from "./charts/DailyMoodProgressionChart";

const DailyMoodCard = () => {
  const [dataMood, setDataMood] = useState([]);
  const [loadingMood, setLoadingMood] = useState(true);
  const [dataProgress, setDataProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [positions, setPositions] = useState([]); // Pozíciók listája
  const [selectedPositions, setSelectedPositions] = useState([]); // Kiválasztott pozíciók

  // Pozíciók lekérése az API-ból
  const fetchPositions = async () => {
    try {
      const response = await fetch("/api/positions");
      const result = await response.json();
      setPositions(result);
    } catch (error) {
      console.error("Hiba a pozíciók lekérésekor:", error);
    }
  };

  const fetchMoodData = async () => {
    try {
      const params = new URLSearchParams({
        positions: selectedPositions.join(","),
      });
    
      const response = await fetch(`/api/daily-mood?${params}`);
      const result = await response.json();

      setDataMood(result);
      setLoadingMood(false);
    } catch (error) {
      console.error("Hiba az adatok lekérésekor:", error);
    }
  };
  const fetchProgressData = async () => {
    try {
      const params = new URLSearchParams({
        positions: selectedPositions.join(","),
      });
      const response = await fetch(`/api/daily-mood-progress?${params}`); // Cseréld le az API végpontra
      const data = await response.json();

      // Az adatok beállítása a pie charthoz
      const totalEmployees = data[0].total; // Az összes dolgozó
      const completed = data[0].completed; // A kérdőívet kitöltött dolgozók száma

      // A chart adatainak előkészítése
      setDataProgress({
        labels: ["Kitöltött", "Nem kitöltött"],
        datasets: [
          {
            label: "",
            data: [completed, totalEmployees - completed],
            backgroundColor: ["#d3135c", "#becfe3"], // Zöld és piros színek
            borderColor: ["#d3135c", "#becfe3"],
            borderWidth: 1,
          },
        ],
      });
      setLoadingProgress(false);
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  useEffect(() => {
   
    fetchPositions();
    fetchMoodData();
    fetchProgressData();
    const interval = setInterval(() => {
      fetchMoodData(), fetchProgressData();
    }, 60000); // Frissítés percenként
    return () => clearInterval(interval);
  }, [selectedPositions]);

  const handlePositionChange = (e) => {
    const value = String(e.target.value); // Az értéket sztringgé alakítjuk
   
    setSelectedPositions((prev) => {
      const updated = prev.includes(value) ? prev.filter((id) => id !== value) : [...prev, value];
 
      return updated;
    });
  };

 

 

 

  return (
    <div className="mood-card">
      <h1>Napi Kedv Adatok</h1>
      <div className="filters">
        <h4>Szűrés pozíciók alapján:</h4>
        <div className="checkbox-group">
          {positions.map((position) => (
            <label key={position.id}>
              <input
                type="checkbox"
                value={String(position.id)} // Pozíció azonosító sztringként
                onChange={handlePositionChange}
                checked={selectedPositions.includes(String(position.id))}
              />
              {position.name}
            </label>
          ))}
        </div>
      </div>
      <div className="container">
          <DailyMoodChart loading={loadingMood} data={dataMood}/>
          <DailyMoodProgressionChart loading={loadingProgress} chartData={dataProgress}/>
      </div>
    </div>
  );
};

export default DailyMoodCard;

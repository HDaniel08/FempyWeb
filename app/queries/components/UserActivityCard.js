'use client';

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './UserActivityCard.css';

const UserActivityCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivityData = async () => {
    try {
      const response = await fetch('/api/user-activity');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Hiba az adatok lekérésekor:', error);
    }
  };

  useEffect(() => {
    fetchActivityData(); 
    const interval = setInterval(() => {
        fetchActivityData();
      }, 60000); // Frissítés percenként
      return () => clearInterval(interval);
    }, []);
  // Egyedi pozíciók az adatok alapján
  const uniquePositions = [...new Set(data.map((item) => item.pozicio))];

  // Dátumok listájának előállítása
  const uniqueDates = [...new Set(data.map((item) => item.nap))].sort();

  const predefinedColors = [
    'rgba(54, 162, 235, 1)',  // Kék
    'rgba(255, 99, 132, 1)',  // Piros
    'rgba(75, 192, 192, 1)',  // Zöld
    'rgba(153, 102, 255, 1)', // Lila
    'rgba(255, 206, 86, 1)',  // Sárga
  ];
  // Datasetek előkészítése minden pozícióhoz
  const datasets = uniquePositions.map((pozicio, index) => {
    const pozicioAdatok = uniqueDates.map((nap) => {
      const talalat = data.find((item) => item.pozicio === pozicio && item.nap === nap);
      return talalat ? talalat.atlagos_hasznalat : 0;
    });
    const pozicioNev = data.find((item) => item.pozicio === pozicio)?.pozicio_nev || `Pozíció ${pozicio}`;

  
    return {
      label: pozicioNev,
      data: pozicioAdatok,
      borderColor: predefinedColors[index % predefinedColors.length], // Színek ciklikus hozzárendelése
      backgroundColor: 'rgba(0, 0, 0, 0)', // Nincs háttérkitöltés
      borderWidth: 1.5, // Csökkentett vonalvastagság
      fill: false,
      tension: 0.1,
      pointRadius: 1, // Pontok alapértelmezetten kikapcsolva
      pointHoverRadius: 6, // Csak hover esetén jelenjenek meg a pontok
    };
  });

  const chartData = {
    labels: uniqueDates, // Az X-tengely dátumcímkéi
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
          top: 10, // Felül a legendának több hely
          bottom: 20,
        },
      },
      plugins: {
        legend: {
          position: 'bottom', // A legendát felül helyezzük el
          labels: {
            usePointStyle: true, // Kör formájú jelölők
            font: {
              size: 12,
            },
            color: '#333',
          },
        },
        tooltip: {
            enabled: true, // Tooltipek engedélyezése
            callbacks: {
              label: (tooltipItem) => `Átlagos használat: ${Math.round(tooltipItem.raw * 100) / 100}`, // Testreszabott tooltip
            },
          },
          datalabels: {
            display: false, // Értékek elrejtése
          },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#666',
        },
      },
      x: {
        ticks: {
          color: '#666',
        },
      },
    },
    labels: data.map((item) => {
      const date = new Date(item.nap);
      return date.toLocaleDateString("hu-HU", {
        month: "short",
        day: "numeric",
      });
    }),
  };

  return (
    <div className="activity-card">
      <h3>Felhasználói aktivitás</h3>
      <h4>Az elmúlt 7 napban mért felhasználói aktivitás pozíciók alapján</h4>
      {loading ? (
        <p>Betöltés...</p>
      ) : (
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default UserActivityCard;

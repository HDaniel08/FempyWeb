import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import './DailyMoodChart.css';

const DailyMoodChart=({loading,data})=>{

    const chartData = {
        labels: data.map((item) => item.nap),
    
        datasets: [
          {
            data: data.map((item) => item.kedv),
            backgroundColor: data.map((_, index) =>
              index === data.length - 1
                ? "rgba(211, 19, 92, 0.8)"
                : "rgba(54, 162, 235, 0.6)"
            ),
            borderColor: data.map((_, index) =>
              index === data.length - 1
                ? "rgba(211, 19, 92, 1)"
                : "rgba(54, 162, 235, 1)"
            ),
            borderWidth: 1,
          },
        ],
      };
    
      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
        },
        plugins: {
          legend: {
            display: false, // Ne jelenjen meg a legend
          },
          tooltip: {
            backgroundColor: "rgba(0,0,0,0.7)",
            titleFont: { size: 14, weight: "bold" },
            bodyFont: { size: 12 },
            bodySpacing: 6,
            padding: 10,
            borderColor: "rgba(255,255,255,0.3)",
            borderWidth: 1,
            callbacks: {
              title: (tooltipItems) => {
                const rawDate = tooltipItems[0].label; // Nyers címke
                const date = new Date(rawDate); // Dátum formázása
                return date.toLocaleDateString("ko-KR");
              },
              label: (tooltipItem) =>
                `Kedv: ${Math.round(tooltipItem.raw * 100) / 100}`,
            },
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#9da9b8",
              font: {
                size: 15,
                weight: 400,
              },
            },
          },
          y: {
            grid: {
              color: "#e6e6e6",
              borderDash: [3, 3], // Dotted grid lines
            },
            ticks: {
              color: "#9da9b8",
              stepSize: 1,
              beginAtZero: false,
              max: 5,
    
              font: {
                size: 15,
                weight: 400,
              },
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
    
    return(<>
          {loading ? (
          <p>Betöltés...</p>
        ) : (
          <div className="chart-container">
            <h3>Előző 5 nap átlagos kedve</h3>
            <div  className="chart">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
    </>)
   
}   
export default DailyMoodChart;
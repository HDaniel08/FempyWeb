import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import './DailyMoodProgressionChart.css';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);
const DailyMoodProgressionChart = ({ loading, chartData }) => {
  const chartOption = {
    animation: {
      duration: 1000, // Animáció időtartama
      easing: "easeInOutQuad", // Animáció sebesség görbéje
    },
    responsive: true,

    plugins: {
      legend: {
        display: false, // Ne jelenjen meg a legend
      },
      datalabels: {
        color: "white", // A felirat színe
        font: {
          weight: "bold",
          size: 14, // Betűméret
        },
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1); // Százalék kiszámítása
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <>
      {loading ? (
        <p>Betöltés...</p>
      ) : (
        <div className="chart-container">
          <h3>Mai nap kitöltöttsége</h3>
          <div className="pie-chart">
            <Pie data={chartData} options={chartOption} />
          </div>
        </div>
      )}
    </>
  );
};

export default DailyMoodProgressionChart;

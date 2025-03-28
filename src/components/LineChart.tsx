import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  labels: string[];
  values: number[];
}

const LineChartComponent: React.FC<Props> = ({ labels, values }) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Cash",
        data: values,
        borderColor: "#E35FFF", // Line color
        backgroundColor: "rgba(185,68,210, 0.5)", // Fill color with transparency
        fill: true, // Enables area fill under the line
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to resize both ways
    plugins: {
      legend: { display: false }, // Hide legend
      title: {
        display: true,
        text: "Cash positions", // Chart title
        font: {
          size: 15, // Adjust title font size
          weight: 500,
        },
        align: "start" as "start" | "end" | "center",
        color: "#333", // Title color
        padding: { top: 0, bottom: 15 }, // Adds spacing around title
      },
    },
    scales: {
      x: {
        title: { display: false, text: "Date" },
        grid: { display: false }, // Removes vertical grid lines
      },
      y: {
        title: { display: false, text: "Total cash balance" },
        beginAtZero: false, // false for auto-scale
        suggestedMin: Math.min(...values) * 0.9, // Set min slightly below the lowest value
        suggestedMax: Math.max(...values) * 1.1, // Set max slightly above the highest value
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChartComponent;

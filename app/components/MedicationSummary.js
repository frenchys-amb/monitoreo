import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const MedicationSummary = ({ medicationData }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (medicationData.length > 0 && chartContainer.current) {
      const labels = medicationData.map((medication) => medication.name);
      const quantities = medicationData.map((medication) => medication.quantity);

      const ctx = chartContainer.current.getContext("2d");

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Quantity",
              data: quantities,
              backgroundColor: "#3182ce",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }, [medicationData]);

  return <canvas ref={chartContainer} />;
};

export default MedicationSummary;

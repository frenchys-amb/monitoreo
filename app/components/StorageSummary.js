import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const StorageSummary = ({ storageData }) => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (storageData.length > 0 && chartContainer.current) {
      const labels = storageData.map((storage) => storage.location);
      const capacities = storageData.map((storage) => storage.capacity);

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
              label: "Capacity",
              data: capacities,
              backgroundColor: "#38a169",
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
  }, [storageData]);

  return <canvas ref={chartContainer} />;
};

export default StorageSummary;

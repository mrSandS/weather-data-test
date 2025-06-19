let chart = null;

// Initialize date inputs with current date
function initDateTimeInputs() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  document.getElementById("startTime").value = todayStr;
  document.getElementById("endTime").value = todayStr;
}

// Fetch data from API
async function fetchData() {
  const city = document.getElementById("citySelect").value;
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  try {
    const response = await fetch(
      `/api/temperature/${city}/range?start=${startTime}&end=${endTime}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Expected array but got:", typeof data);
      return;
    }

    if (data.length === 0) {
      console.log("No data available for the selected time range");
      return;
    }

    createChart(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function createChart(data) {
  const ctx = document.getElementById("temperatureChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  // Prepare data for chart
  const chartData = data.map((d) => ({
    x: parseInt(d.timestamp),
    o: parseFloat(d.open),
    h: parseFloat(d.high),
    l: parseFloat(d.low),
    c: parseFloat(d.close),
  }));

  chart = new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [
        {
          label: "Temperature",
          data: chartData,
          color: {
            up: "#00ff00",
            down: "#ff0000",
            unchanged: "#000000",
          },
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "minute",
            displayFormats: {
              minute: "HH:mm",
              hour: "HH:mm",
            },
          },
          title: {
            display: true,
            text: "Time",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)",
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const point = context.raw;
              const time = new Date(point.x).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });
              return [
                `Time: ${time}`,
                `Open: ${point.o.toFixed(1)}°C`,
                `High: ${point.h.toFixed(1)}°C`,
                `Low: ${point.l.toFixed(1)}°C`,
                `Close: ${point.c.toFixed(1)}°C`,
              ];
            },
          },
        },
        title: {
          display: true,
          text: "Temperature Candlesticks",
        },
      },
    },
  });
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  initDateTimeInputs();
  fetchData();
});

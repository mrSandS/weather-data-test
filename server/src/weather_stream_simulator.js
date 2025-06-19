// Run it: node weather_stream_simulator.js
const WebSocket = require("ws");
const fetch = require("node-fetch");

const PORT = 8765;
const INTERVAL_MS = 100; // ~10 events/second

const cities = {
  Berlin: [52.52, 13.41],
  NewYork: [40.71, -74.01],
  Tokyo: [35.68, 139.69],
  SaoPaulo: [-23.55, -46.63],
  CapeTown: [-33.92, 18.42],
};

const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`🌍 Weather WebSocket server running at ws://localhost:${PORT}`);
});

wss.on("connection", (ws) => {
  console.log("🟢 Client connected");

  const interval = setInterval(async () => {
    const cityNames = Object.keys(cities);
    const city = cityNames[Math.floor(Math.random() * cityNames.length)];
    const [lat, lon] = cities[city];
    try {
      // const response = await fetch(
      //   `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      // );
      // const data = await response.json();
      const data = generateRandomWeatherData();
      const weather = data.current_weather;
      if (weather) {
        const event = {
          city,
          timestamp: weather.time,
          temperature: weather.temperature,
          windspeed: weather.windspeed,
          winddirection: weather.winddirection,
        };
        ws.send(JSON.stringify(event));
      }
    } catch (err) {
      console.error("Error fetching weather data:", err.message);
    }
  }, INTERVAL_MS);

  ws.on("close", () => {
    console.log("🔴 Client disconnected");
    clearInterval(interval);
  });
});

function generateRandomWeatherData() {
    // Base time plus random offset (up to 12 hours)
    const baseTime = new Date("2025-06-18T13:00:00Z");
    const randomOffset = Math.floor(Math.random() * 12 * 3600 * 1000); // Random milliseconds up to 12 hours
    const randomTime = new Date(baseTime.getTime() + randomOffset);

    const data = {
        current_weather: {
            time: randomTime.toISOString(),
            temperature: Math.floor(15 + Math.random() * 15), // Random between 15-30
            windspeed: 10,
            winddirection: 180,
        },
    };

    return data;
}

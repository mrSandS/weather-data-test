require("dotenv").config();
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const path = require("path");
const TemperatureAggregator = require("./src/services/TemperatureAggregator");
const temperatureRoutes = require("./src/routes/temperature");

const app = express();
const port = process.env.PORT || 3000;

// Initialize temperature aggregator
const temperatureAggregator = new TemperatureAggregator();

// WebSocket connection function
function connectWebSocket() {
  const weatherWs = new WebSocket("ws://localhost:8765");

  weatherWs.on("open", () => {
    console.log("Connected to weather stream");
  });

  weatherWs.on("message", (data) => {
    try {
      const event = JSON.parse(data);
      if (event.city && event.temperature && event.timestamp) {
        temperatureAggregator.processTemperature(
          event.city,
          event.temperature,
          event.timestamp
        );
      }
    } catch (error) {
      console.error("Error processing weather data:", error);
    }
  });

  weatherWs.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });

  weatherWs.on("close", () => {
    console.log("Disconnected from weather stream");
    setTimeout(() => {
      console.log("Attempting to reconnect...");
      connectWebSocket();
    }, 5000);
  });

  return weatherWs;
}

// Initial WebSocket connection
const weatherWs = connectWebSocket();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware would be applied here
// Example:
// const authMiddleware = require('./src/middleware/auth');
// app.use(authMiddleware);

// Routes
app.use("/api/temperature", temperatureRoutes(temperatureAggregator));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    weatherStreamConnected: weatherWs.readyState === WebSocket.OPEN,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Temperature API server running on port ${port}`);
});

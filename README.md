# Weather Data Aggregation Test

A test task that simulates real-time temperature data aggregation from a WebSocket stream into hourly candlestick charts.

## Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Start Weather Stream Simulator
```bash
yarn simulator
```
This generates temperature data at ~10 events/sec for different cities.

### 3. Start Express Server
```bash
# In a new terminal
yarn dev
```

### 4. Open Frontend
Navigate to `http://localhost:3000` in your browser.

## What You'll See

- **Weather Simulator**: Generating temperature data for multiple cities
- **Express Server**: Aggregating data into hourly OHLC candlesticks
- **Frontend Chart**: Interactive candlestick visualization with Chart.js

## Important Notes

- **Chart Display**: The chart requires at least two candlesticks to display properly.
To generate mock data, uncomment the generateRandomWeatherData() function call in weather_stream_simulator.js.
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
This generates temperature data at 10-20 events/sec for Berlin, London, and Paris.

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
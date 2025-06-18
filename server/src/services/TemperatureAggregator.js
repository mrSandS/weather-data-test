const moment = require("moment");
const TemperatureCandlestick = require("../models/TemperatureCandlestick");

class TemperatureAggregator {
  constructor() {
    // Map of city -> Map of hourTimestamp -> TemperatureCandlestick
    this.cityCandlesticks = new Map();
  }

  processTemperature(city, temperature, timestamp) {
    const hourTimestamp = moment(timestamp).startOf("hour").valueOf();

    if (!this.cityCandlesticks.has(city)) {
      this.cityCandlesticks.set(city, new Map());
    }

    const cityData = this.cityCandlesticks.get(city);
    if (!cityData.has(hourTimestamp)) {
      cityData.set(
        hourTimestamp,
        new TemperatureCandlestick(city, hourTimestamp)
      );
    }

    const candlestick = cityData.get(hourTimestamp);
    candlestick.update(temperature);
  }

  getCandlesticks(city, startTime, endTime) {
    if (!this.cityCandlesticks.has(city)) {
      return [];
    }

    const start = moment(startTime).startOf("hour").valueOf();
    const end = moment(endTime).endOf("hour").valueOf();
    
    const cityData = this.cityCandlesticks.get(city);
    return Array.from(cityData.entries())
      .filter(([timestamp]) => timestamp >= start && timestamp <= end)
      .map(([, candlestick]) => candlestick.toJSON())
      .sort((a, b) => a.timestamp - b.timestamp);
  }
}

module.exports = TemperatureAggregator;

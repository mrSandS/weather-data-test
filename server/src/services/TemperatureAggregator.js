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

    const cityData = this.cityCandlesticks.get(city);
    return Array.from(cityData.entries())
      .filter(([timestamp]) => timestamp >= startTime && timestamp < endTime)
      .map(([, candlestick]) => candlestick.toJSON())
      .sort((a, b) => a.timestamp - b.timestamp);
  }
}

module.exports = TemperatureAggregator;

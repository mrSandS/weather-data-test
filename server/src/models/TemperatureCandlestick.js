class TemperatureCandlestick {
  constructor(city, timestamp) {
    this.city = city;
    this.timestamp = timestamp;
    this.open = null;
    this.high = -Infinity;
    this.low = Infinity;
    this.close = null;
  }

  update(temperature) {
    if (this.open === null) {
      this.open = temperature;
    }
    this.high = Math.max(this.high, temperature);
    this.low = Math.min(this.low, temperature);
    this.close = temperature;
  }

  toJSON() {
    return {
      city: this.city,
      timestamp: this.timestamp,
      open: this.open,
      high: this.high,
      low: this.low,
      close: this.close,
    };
  }
}

module.exports = TemperatureCandlestick;

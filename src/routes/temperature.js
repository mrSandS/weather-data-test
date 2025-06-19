const express = require("express");
const router = express.Router();
const moment = require("moment");

module.exports = (temperatureAggregator) => {
  // ===== AUTHORIZATION HEADERS CHECKING =====
  // Middleware verified Authorization header exists and is valid

  // ===== USER IDENTITY OR SCOPE PARSING =====
  // Middleware extracted user info from JWT token

  // ===== ROLE-BASED ACCESS CONTROL =====
  // Middleware checked user roles and permissions

  // Get temperature candlesticks for a city in a date range
  router.get("/:city/range", (req, res) => {

    const { city } = req.params;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        error: "Both start and end parameters are required",
      });
    }

    try {
      const startDate = moment(start).startOf("day");
      const endDate = moment(end).endOf("day");

      if (!startDate.isValid() || !endDate.isValid()) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD format",
        });
      }

      if (endDate.diff(startDate, "days") > 30) {
        return res.status(400).json({
          error: "Date range cannot be more than 30 days",
        });
      }

      const candlesticks = temperatureAggregator.getCandlesticks(
        city,
        startDate.valueOf(),
        endDate.valueOf()
      );

      res.json(candlesticks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};

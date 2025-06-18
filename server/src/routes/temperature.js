const express = require('express');
const router = express.Router();
const moment = require('moment');

module.exports = (temperatureAggregator) => {
    // Get temperature candlesticks for a city in a date range
    router.get('/:city/range', (req, res) => {
        const { city } = req.params;
        const { start, end } = req.query;
        
        if (!start || !end) {
            return res.status(400).json({ 
                error: 'Both start and end parameters are required' 
            });
        }

        try {
            const startTime = moment(start, 'YYYY-MM-DD');
            const endTime = moment(end, 'YYYY-MM-DD');

            if (!startTime.isValid() || !endTime.isValid()) {
                return res.status(400).json({ 
                    error: 'Invalid date format. Use YYYY-MM-DD format' 
                });
            }

            const candlesticks = temperatureAggregator.getCandlesticks(
                city,
                startTime.valueOf(),
                endTime.valueOf()
            );

            res.json(candlesticks);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    return router;
}; 
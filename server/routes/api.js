const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/api', (req, res) => {
    res.json({
        chars: ["a", "b", "c"]
    });
});

module.exports = router;
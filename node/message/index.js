const express = require('express');
const router = express.Router();

router.get('/message', (req, res) => {
    res.send("POST /v1/message")
});

module.exports = router;
const config = require('../config');
const express = require('express');
const router = express.Router();
const sql = require("msnodesqlv8");

router.get('/today', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    res.render('class.ejs', {
        config: config,
        req: req,
    });
});

module.exports = router;

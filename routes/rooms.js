const config = require('../config');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    res.render('rooms', {
        config: config,
        req: req,
    });
});

router.get('/reservation', async (req, res) => {
    if (config.debug) {
        console.log(req.session);
        console.log(req.body);
    } else {
        console.log(req.session.user);
    }
    res.render('rooms', {
        config: config,
        req: req,
    });
});

module.exports = router;

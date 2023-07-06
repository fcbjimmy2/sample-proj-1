const config = require('../config');
const express = require('express');
const router = express.Router();
const flash = require('connect-flash');

router.get('/', async (req, res) => {
    // login page
    res.render('index', {
        config: config,
        req: req,
        message: req.flash('message')
    });
});

module.exports = router;

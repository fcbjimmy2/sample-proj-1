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
    if (req.session.home === 'messenger') {
        res.redirect('/user/messenger');
    } else if (req.session.home === 'task') {
        res.redirect('/user/task');
    } else if (req.session.home === 'dashboard') {
        res.redirect('/user/dashboard');
    } else if (req.session.home === 'schedule') {
        res.redirect('/user/schedule');
    } else {
        res.render('home', {
            config: config,
            req: req,
        });
    }
});

module.exports = router;

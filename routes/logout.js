const express = require('express');
const router = express.Router();
const today = new Date().toLocaleString('en-US', {timeZone: 'GMT'});

/* Logout */
router.get('/', async (req, res) => {
    console.log('logout:' + req.session.user)
    console.log(today);
    console.log('sessionID: ' + req.sessionID);
    console.log(req.session);
    res.cookie("connect.sid", "", {expires: new Date()});
    req.session.destroy();
    console.log('Redirecting to login page');
    res.redirect(307, '/');
});
module.exports = router;
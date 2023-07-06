'use strict';
const config = require('./config');
const i18n = require('./i18n');
const checkauth = require('./checkauth');
const checklang = require('./checklang');
const clearcache = require('./clearcache');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
//const sql = require('msnodesqlv8');
//const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const flash = require('connect-flash');
const app = express();
// const FileStore = require('session-file-store')(session);
// const MemcachedStore = require('connect-memcached')(session);
const MemoryStore = require('memorystore')(session)

// view engine setup
app.set('view engine', 'ejs');
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/claims', express.static(path.join(__dirname, 'claims')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(session({
    cookie: {maxAge: 86400000},
    store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 30 // 30 mins
    }),
    secret: 'TopSecret#28937713',
    saveUninitialized: false,
    resave: true,
    rolling: true
}));

/*app.use(session({
    genid: (req) => {
        return crypto.randomBytes(16).toString('hex');
    },
    name: 'do2core.sid',
    secret: "TopSecret#28937713",
    resave: true,
    saveUninitialized: false,
    rolling: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 30 // 30 mins
    }
}));*/
app.use(clearcache);
app.use(checklang);
app.use(i18n);
app.use(flash());

//------------------------------------------------------------------------------------
// Router
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use(checkauth);
// don't accept anonymous from below
app.use('/logout', require('./routes/logout'));
app.use('/user', require('./routes/user'));
app.use('/home', require('./routes/home'));
app.use('/prod', require('./routes/prod'));
app.use('/fup', require('./routes/fup'));
app.use('/course', require('./routes/course'));
app.use('/class', require('./routes/class'));
app.use('/oper', require('./routes/oper'));
app.use('/teachers', require('./routes/teachers'));
app.use('/assets', require('./routes/assets'));
app.use('/rooms', require('./routes/rooms'));
app.use('/applications', require('./routes/applications'));
app.use('/students', require('./routes/students'));
app.use('/invoice', require('./routes/invoice'));
app.use('/system', require('./routes/system'));


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
    if (req.app.get('env') === 'production') {
        console.log('this is PROD');
        res.locals.error.status = '404';
        res.locals.error.message = 'Please contact system administrator.'
    }
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
// ------------------------------------------------------

// const start = async () => {
//     try {
//         await app.listen(process.env.PORT || config.servicePort);
//     } catch (err) {
//         app.log.error(err);
//         process.exit(1);
//     }
// };
const start = async () => {
    try {
        await app.listen(3000);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();

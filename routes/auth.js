const config = require('../config');
const express = require('express');
const router = express.Router();
const sql = require('msnodesqlv8');
const fs = require("fs");
const flash = require('connect-flash');

router.post('/', async (req, res) => {
    console.log("abc");
    if (config.debug) {
        console.log("session", req.session);
        console.log("body", req.body);
    } else {
        console.log("user", req.session.user);
    }
    let username = req.body.userid;
    let password = req.body.userpassword;
    let data = {};
    if (username && password) {
        function get_User() {
            let query = "EXEC sp_User_Login @Login = ?, @Password = ?";
            console.log("query", query);
            return new Promise((resolve) => {
                setTimeout(() => {
                    sql.query(config.db, query, [username, password], (error, results) => {
                        if (!error) {
                            data = results;
                            console.log("data returned : " + JSON.stringify(results));
                            resolve();
                        } else {
                            console.log(error);
                        }
                    });
                }, 10); //1/10 sec
            })
        }

        await get_User();
        if (data.length > 0) {
            // Authenticate the user
            // console.log(data[0]);
            req.session.loggedin = true;
            req.session.user = data[0].Login;
            req.session.usercode = data[0].UserCode;
            req.session.email = data[0].Email;
            req.session.userrole = data[0].Role;
            req.session.branchcode = data[0].BranchCode;
            req.session.home = data[0].Default_Home;
            req.session.theme = data[0].Default_ThemeClass;
            req.session.allow = data[0].Features;
            req.session.punching = '';
            console.log(req.session);

            function checkPhoto() {
                let checkPath = config.avator_images + req.session.usercode + '.jpg';
                console.log('check photo');
                console.log(checkPath);
                if (fs.existsSync(checkPath)) {
                    //file exists
                    photo = 'exist';
                } else {
                    // file no exists
                    photo = 'not_exist';
                    console.log('photo for (' + req.session.usercode + ') not found, use default instead.')
                }
            }

            await checkPhoto();
            if (photo === 'exist') {
                req.session.photo = req.session.usercode;
            } else {
                req.session.photo = 'default';
            }
            res.redirect('/home');
        } else {
            console.log('record not found')
            req.flash('message', ['Wrong UserID/Password / 用戶/密碼 錯誤']);
            res.redirect('/');
        }
    } else {
        req.flash('message', ['Please enter UserID/Password / 請輸入用戶/密碼']);
        res.redirect('/');
        res.end();
    }
});

module.exports = router;

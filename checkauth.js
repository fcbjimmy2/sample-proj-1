module.exports = (req, res, next) => {
    if (req.session.loggedin) {
        next();
    } else {
        req.flash('message', ['PLEASE LOGIN / 請先登入']);
        res.redirect("/");
    }
};
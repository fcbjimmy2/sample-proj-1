module.exports = (req, res, next) => {
    // This reads the accept-language header
    // and returns the language if found or false if not
    const lang = req.acceptsLanguages('en', 'zh-HK', 'zh-CN')
    // console.log(lang);
    if (lang) { // if found, attach it as property to the request
        req.lang = lang;
    } else { // else set the default language
        req.lang = 'en';
    }
    next()
};
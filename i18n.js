const i18n = require("i18n");

i18n.configure({
  locales: ["en", "zh-HK", "zh-CN"],
  cookie: "lang",
  header: "accept-language",
  queryParameter: "lang",
  directory: __dirname + "/locales",
  defaultLocale: "en",
});
module.exports = (req, res, next) => {
  let { lang } = req.query;
  i18n.init(req, res);
  lang = lang ? lang : req.session.lang || req.lang;
  // console.log('18->'+lang);
  i18n.setLocale(req, lang);
  req.session.lang = lang;
  return next();
};

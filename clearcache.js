module.exports = (req, res, next) => {
    // period in second
    const period = 0
    // you only want to cache for GET requests
    if (req.method === 'GET') {
        res.set('Cache-control', `public, max-age=${period}`)
    } else {
        // for the other requests set strict no caching parameters
        res.set('Cache-control', `no-store`)
    }
    res.removeHeader("x-powered-by");
    next();
};
function httpsRedirect(req, res, next) {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
    }

    return next();
}

module.exports = httpsRedirect;

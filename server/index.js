const express = require('express');
const compression = require('compression');
const path = require('path');
const httpsRedirect = require('./https');

const app = express();

const THE_PATH = path.resolve(__dirname, '../dist');
const MAX_AGE = process.env.CONTENT_MAX_AGE || '24h';

app.set('port', (process.env.PORT || 5000));

app.use(httpsRedirect);
app.use(compression());

app.use(express.static(THE_PATH, {
    etag: true,
    extensions: [
        'html',
    ],
    immutable: true,
    maxAge: MAX_AGE,
}));

app.use((req, res) => {
    if (req.url.indexOf('404') < 0) {
        res.redirect('/404');
    } else {
        res.sendStatus(404);
    }
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});

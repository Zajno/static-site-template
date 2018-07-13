const express = require('express');
const compression = require('compression');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(compression());

app.use(express.static('dist', {
    etag: true,
    extensions: [
        'html',
    ],
    immutable: true,
    maxAge: '24h',
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

const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(PORT);

app.get('/', function (req, res, next) {
    var body = {"ipaddress": null, "language": null, "software": null};
    body.language = req.headers['accept-language'].replace(/([^,]*)(?:.*)/i, '$1');
    body.software = req.headers['user-agent'].replace(/(?:.*)\((.*)\)(?:.*)/i, '$1');
    body.ipaddress = req.headers['host'].replace(/([^:]*)(?:.*)/i, '$1');
    res.send(body);
});

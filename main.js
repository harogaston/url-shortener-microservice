var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var body = {"ipaddress": null, "language": null, "software": null};
    body.language = req.headers['accept-language'].replace(/([^,]*)(?:.*)/i, '$1');
    body.software = req.headers['user-agent'].replace(/(?:.*)\((.*)\)(?:.*)/i, '$1');
    body.ipaddress = req.headers['host'].replace(/([^:]*)(?:.*)/i, '$1');
    res.send(body);
});

module.exports = router;

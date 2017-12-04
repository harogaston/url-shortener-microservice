const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
var MongoClient = require('mongodb').MongoClient;
var MONGO_URL = 'mongodb://freecodecamp:freecodecamp@ds135382.mlab.com:35382/freecodecamp-gh';

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.listen(PORT);


app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/new/*', function (req, res, next) {
    var url = Object.values(req.params)[0];
    if (!checkURL(url)) {
        res.send({error: "Wrong url format, make sure you have a valid protocol and real site."});
    } else {
        res.send(insert(url));
    }
});

app.get('/:short', function (req, res, next) {
    query(req.params['short'], res);
});

function insert(url) {
    var shortURL = url.hashCode();
    var tuple = {original_url: url, short_url: shortURL};
    MongoClient.connect(MONGO_URL, function (err, db) {
        if (err) throw err;
        db.collection("urls").insertOne(tuple, function (err, res) {
            if (err) throw err;
            db.close();
        });
        db.close();
    });
    return tuple;
}

function query(shortURL, res) {
    MongoClient.connect(MONGO_URL, function (err, db) {
        if (err) throw err;
        var query = {short_url: shortURL};
        return db.collection("urls").find({}).toArray().then(function (result) {
                result = result.find(function (curr) {
                    return curr.short_url == shortURL
                });
                if (result != undefined) {
                    res.redirect(result.original_url);
                } else {
                    res.send({error: "Invalid shortened URL."});
                }
            }
        );
    });
}

function checkURL(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}

String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

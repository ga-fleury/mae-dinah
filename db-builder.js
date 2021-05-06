const FetchCrawler = require("@viclafouch/fetch-crawler");
const fs = require("fs");

var Twit = require("twit");

var config = require("./config.js");

var T = new Twit(config);

var Datastore = require("nedb"),
    db = new Datastore({ filename: "respostas.db" });
db.loadDatabase(function (err) {
    // Callback is optional
    // Now commands will be executed
});
// `$ = Cheerio to get the content of the page
// See https://cheerio.js.org
const collectContent = ($) =>
    $("body")
        .find("p.horoscope-list__description")
        .text()
        .replaceAll("Confira todas as previsões para o seu signo em 2021", "")
        .replace(/^\s*\n/gm, "")
        .replace(/  +/g, "")
        .trim();

// After getting content of the page, do what you want :)
// Accept async function
const doSomethingWith = (content, url) => {
    var output = content.split("\n");

    const res = output.reduce(
        (acc, curr, index) => ((acc[index] = curr), acc),
        {}
    );

    // console.log(res);
    // db.insert(res);
};

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[(keys.length * Math.random()) << 0]];
};

var randomMsg;

module.exports = {
    aleatorio:
    function postarStatusAleatorio() {
        db.find({}, function (err, docs) {
            var index = Math.floor(Math.random() * 6);
            randomMsg = randomProperty(docs[index]);
            console.log(randomMsg);
            var randomMsgFinal = randomMsg + " 🔮✨";
            T.post("statuses/update", { status: randomMsgFinal }, tweeted);
        });
    }
}



// Here I start my crawler
// You can await for it if you want
FetchCrawler.launch({
    url: "https://f5.folha.uol.com.br/horoscopo/",
    evaluatePage: ($) => collectContent($),
    onSuccess: ({ result, url }) => doSomethingWith(result, url),
    onError: ({ error, url }) =>
        console.log("Whouaa something wrong happened :("),
    maxRequest: 1,
});

function tweeted(err, data, response) {
    if (err) {
        console.log("algo de errado não está certo");
    } else {
        console.log("os espíritos receberam a sua mensagem 🔮");
    }
}

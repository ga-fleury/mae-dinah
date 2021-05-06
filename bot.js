const FetchCrawler = require("@viclafouch/fetch-crawler");
const fs = require("fs");

require("dotenv").config();

var singlePost = require("./db-builder.js");

var Twit = require("twit");

// var config = require("./config.js");

var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

var data = new Date();
var dia = ("0" + data.getDate()).slice(-2);
var mes = ("0" + (data.getMonth() + 1)).slice(-2);

var zodiaco = {
    aries: {
        nome: "Áries",
        simbolo: "♈",
        horoscopo: "",
    },
    touro: {
        nome: "Touro",
        simbolo: "♉",
        horoscopo: "",
    },
    gemeos: {
        nome: "Gêmeos",
        simbolo: "♊",
        horoscopo: "",
    },
    cancer: {
        nome: "Câncer",
        simbolo: "♋",
        horoscopo: "",
    },
    leao: {
        nome: "Leão",
        simbolo: "♌",
        horoscopo: "",
    },
    virgem: {
        nome: "Virgem",
        simbolo: "♍",
        horoscopo: "",
    },
    libra: {
        nome: "Libra",
        simbolo: "♎",
        horoscopo: "",
    },
    escorpiao: {
        nome: "Escorpião",
        simbolo: "♏",
        horoscopo: "",
    },
    sagitario: {
        nome: "Sagitário",
        simbolo: "♐",
        horoscopo: "",
    },
    capricornio: {
        nome: "Capricórnio",
        simbolo: "♑",
        horoscopo: "",
    },
    aquario: {
        nome: "Aquário",
        simbolo: "♒",
        horoscopo: "",
    },
    peixes: {
        nome: "Peixes",
        simbolo: "♓",
        horoscopo: "",
    },
};

setInterval(function () {
    singlePost.aleatorio();
}, 1000 * 60 * 60);

setInterval(function () {
    // `$ = Cheerio to get the content of the page
    // See https://cheerio.js.org
    const collectContent = ($) =>
        $("body").find("div.text  :nth-child(1)").text().trim();

    // After getting content of the page, do what you want :)
    // Accept async function
    const doSomethingWith = (content, url, item) => {
        var corte = content.indexOf("Saiba mais");
        var prediction = content.substring(0, corte);
        zodiaco[item].horoscopo = prediction;
        console.log(item.toUpperCase());
        console.log(`${prediction}`);

        var mensagem =
            zodiaco[item].simbolo +
            " " +
            zodiaco[item].nome +
            " (" +
            dia +
            "/" +
            mes +
            ") - " +
            prediction;
        console.log(mensagem);

        T.post("statuses/update", { status: mensagem }, tweeted);

        itemsProcessed++;
        console.log(itemsProcessed);
        if (itemsProcessed === zodiaco.length) {
            signosProntos();
        }
    };

    // Here I start my crawler
    // You can await for it if you want

    var signo = Object.keys(zodiaco);
    signo.forEach(pegaHoroscopo);

    function signosProntos() {
        console.log("signos prontos");
        console.log(zodiaco);
        fs.writeFileSync("today.json", JSON.stringify(zodiaco));
    }

    var itemsProcessed = 0;

    function pegaHoroscopo(item) {
        FetchCrawler.launch({
            url:
                "https://www.uol.com.br/universa/horoscopo/" +
                item +
                "/horoscopo-do-dia/",
            evaluatePage: ($) => collectContent($),
            onSuccess: ({ result, url }) => {
                doSomethingWith(result, url, item);
            },
            onError: ({ error, url }) =>
                console.log("Whouaa something wrong happened :("),
            maxRequest: 1,
        });
    }
}, 1000 * 60 * 60 * 24);

console.log("bot is starting 🤖");

// T.post("statuses/update", { status: "Os espíritos estão presentes 🔮" }, tweeted);

function tweeted(err, data, response) {
    if (err) {
        console.log("algo de errado não está certo");
    } else {
        console.log("os espíritos receberam a sua mensagem 🔮");
    }
}

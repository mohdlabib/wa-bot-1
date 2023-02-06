const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
let chrome = {};
let options = {};
let client;
const qrcode = require("qrcode-terminal");
const fam = require("./controllers/games/fam");
const lontong = require("./controllers/games/lontong");
const gamecodes = [
    "fam",
    "lontong",
    "caklontong",
    "tebakkata",
    "tebaklirik",
    "tebakkalimat",
];
const lb = require("./controllers/games/lb");
const status = require("./controllers/games/status");
const games = require("./controllers/games/games");
const {
    group,
    error,
    errai,
    autoBot,
    sticker,
    img,
    timer,
} = require("./controllers/utils/autoMsg");
const { ai, tlid, tlen, stden } = require("./controllers/api/ai");
const { cnn, base } = require("./controllers/api/berita");
const { spec, speq, spek, speb, specs } = require("./controllers/api/spec");
const stickers = require("./controllers/api/stickers");
const emojisCmd = [
    "Apple",
    "Google",
    "Samsung",
    "Microsoft",
    "WhatsApp",
    "Twitter",
    "Facebook",
    "JoyPixels",
    "OpenMoji",
    "Emojidex",
    "Messenger",
    "LG",
    "HTC",
    "Mozilla",
    "Softbank",
    "Docomo",
    "AuByKddi",
];
const stickersCmd = [
    "Patrick",
    "Popoci",
    "Sponsbob",
    "Kawansponsbob",
    "awoawo",
    "kelinci",
    "Chat",
    "Dbfly",
    "DinoKuning",
    "Doge",
    "Gojosatoru",
    "HopeBoy",
    "Jisoo",
    "Krrobot",
    "Kucing",
    "ManusiaLidi",
    "Menjamet",
    "Meow",
    "Nicholas",
    "Tyni",
];

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

async function init() {
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        chrome = require("chrome-aws-lambda");
        options = {
            headless: true,
            args: [
                ...chrome.args,
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process", // <- this one doesn't works in Windows
                "--disable-gpu",
                "--hidescrollbars",
                "--disable-web-security",
            ],
            defaultViewport: chrome.defaultViewport,
            ignoreHTTPSError: true,
            executablePath: await chrome.executablePath,
        };
    } else {
        options = {
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process", // <- this one doesn't works in Windows
                "--disable-gpu",
            ],
        };
    }
}

init();
client = new Client({
    restartOnAuthFail: true,
    puppeteer: options,
    authStrategy: new LocalAuth(),
});

app.get("/", async (req, res) => {
    res.sendfile("views/index.html", {
        root: __dirname,
    });
});

client.on("message", async (message) => {
    let chat = await message.getChat();
    await chat.sendSeen();
    let qtmsg = null;
    try {
        if (message.hasQuotedMsg) qtmsg = await message.getQuotedMessage();
    } catch (error) {
        console.log("failed get quoted message");
    }

    //api
    if (
        message.body == "-spec" ||
        message.body == "-spek" ||
        message.body == "-speq"
    ) {
        if (!qtmsg) {
            return speb(message.body, message);
        }
        specs(message.body, qtmsg.body, qtmsg, MessageMedia, chat);
    } else if (message.body.startsWith("-spec ")) {
        spec(message.body.slice("-spec ".length), message, MessageMedia, chat);
    } else if (message.body.startsWith("-spek ")) {
        spek(message.body.slice("-spek ".length), message, MessageMedia, chat);
    } else if (message.body.startsWith("-speq ")) {
        speq(message.body.slice("-speq ".length), message);
    } else if (message.body == "-cnn") {
        base("cnn", "", message);
    } else if (message.body.startsWith("-cnn ")) {
        cnn(message.body.slice("-cnn ".length), message);

        //fitur bot
    } else if (message.body === "-groupinfo") {
        if (chat.isGroup) {
            message.reply(
                `*Group Details*\nName: ${chat.name}\nDescription: ${
                    chat.description
                }\nCreated At: ${chat.createdAt.toString()}\nCreated By: ${
                    chat.owner ? chat.owner.user : "admin"
                }\nParticipant count: ${chat.participants.length}`
            );
        } else {
            group(message);
        }
    } else if (message.body === "-sticker" || message.body == "-s") {
        sticker(message, qtmsg, MessageMedia, client);
    } else if (message.body === "-stickers") {
        let gcs = "*available random stickers*\n";
        stickersCmd.forEach((gc) => {
            gcs += `\n-${gc.toLowerCase()}`;
        });
        if (!stickersCmd.length) gcs += "\nnone";
        gcs += "\n\ntype *-menu* to view full menu.";
        message.reply(gcs);
    } else if (message.body === "-emojis") {
        let gcs = "*available emoji to sticker platform*\n";
        emojisCmd.forEach((gc) => {
            gcs += `\n-${gc.toLowerCase()}`;
        });
        if (!emojisCmd.length) gcs += "\nnone";
        gcs += "\n\ntype *-menu* to view full menu.";
        message.reply(gcs);
    } else if (message.body === "-img" || message.body == "-toimg") {
        img(message, qtmsg, MessageMedia, client);
    } else if (message.body === "-help" || message.body === "-menu") {
        autoBot("menu.txt", message);
    } else if (message.body === "-everyone" || message.body === "-tagall") {
        if (chat.isGroup) {
            let text = "";
            let mentions = [];

            for (let participant of chat.participants) {
                const contact = await client.getContactById(
                    participant.id._serialized
                );

                mentions.push(contact);
                text += `@${participant.id.user} `;
            }

            if (message.body === "-tagall")
                await chat.sendMessage(text, { mentions });
            else await chat.sendMessage("@everyone", { mentions });
        } else {
            group(message);
        }
    } else if (
        message.body === "-hidetag" ||
        message.body.startsWith("-hidetag ")
    ) {
        if (chat.isGroup) {
            const text =
                message.body === "-hidetag"
                    ? qtmsg
                        ? qtmsg.body
                        : "."
                    : message.body.slice("-hidetag ".length);
            let mentions = [];

            for (let participant of chat.participants) {
                const contact = await client.getContactById(
                    participant.id._serialized
                );
                mentions.push(contact);
            }

            message.reply(text, message.from, { mentions });
        } else {
            group(message);
        }
    } else if (
        message.body === "-bot" ||
        (message.body.toLowerCase() === "p" && !chat.isGroup)
    ) {
        message.reply(
            "hi, i'm FreackBot. type *-help* or *-menu* to see valid commands."
        );

        //AI
    } else if (message.body === "-ai" || message.body === "-t") {
        if (!qtmsg) {
            return message.reply(
                "hi, i'm FreackBot. type *-ai* 'message' or *-t* 'message' to talking with me.\n\nyou can talk to me in English or Bahasa Indonesia."
            );
        }
        ai(qtmsg.body, qtmsg);
    } else if (
        message.body.startsWith("-ai ") ||
        message.body.startsWith("-t ")
    ) {
        const cmd = message.body.startsWith("-ai ") ? "-ai " : "-t ";
        ai(message.body.slice(cmd.length), message);
    } else if (message.body === "-tlid" || message.body == "-tlin") {
        if (!qtmsg) {
            return message.reply(
                "hi, i'm FreackBot. type *-tlid* 'message' to translate to bahasa indonesia."
            );
        }
        tlid(qtmsg.body, qtmsg);
    } else if (
        message.body.startsWith("-tlid ") ||
        message.body.startsWith("-tlin ")
    ) {
        try {
            tlid(message.body.slice("-tlid ".length), message);
        } catch (err) {
            errai(message, err);
        }
    } else if (message.body === "-tlen") {
        if (!qtmsg) {
            return message.reply(
                "hi, i'm FreackBot. type *-tlen* 'message' to translate to english."
            );
        }
        tlen(qtmsg.body, qtmsg);
    } else if (message.body.startsWith("-tlen ")) {
        tlen(message.body.slice("-tlen ".length), message);
    } else if (message.body === "-stden") {
        if (!qtmsg) {
            return message.reply(
                "hi, i'm FreackBot. type *-stden* 'message' to correct message to Grammatical Standard English."
            );
        }
        stden(qtmsg.body, qtmsg);
    } else if (message.body.startsWith("-stden ")) {
        stden(message.body.slice("-stden ".length), message);

        //game
        //family100
    } else if (message.body === "-fam") {
        if (chat.isGroup) {
            try {
                const game = fam.setStatus(chat.id.user, 1);
                if (game.status) {
                    fam.setSoal(chat.id.user);
                    const soal = fam.getSoal(chat.id.user);
                    if (!soal.play) {
                        message.reply(soal.msg);
                        return fam.setStatus(chat.id.user, 0);
                    }
                    message.reply(soal.msg);
                    timer(chat.id.user, chat, fam);
                } else {
                    message.reply(game.msg);
                }
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
        //family100
        //lontong
    } else if (message.body === "-lontong") {
        if (chat.isGroup) {
            try {
                const game = lontong.setStatus(chat.id.user, 1);
                if (game.status) {
                    lontong.setSoal(chat.id.user);
                    const soal = lontong.getSoal(chat.id.user);
                    if (!soal.play) {
                        message.reply(soal.msg);
                        return lontong.setStatus(chat.id.user, 0);
                    }
                    message.reply(soal.msg);
                    timer(chat.id.user, chat, lontong);
                } else {
                    message.reply(game.msg);
                }
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
        //lontong
        //caklontong
    } else if (message.body === "-caklontong") {
        if (chat.isGroup) {
            try {
                const game = status.setStatus(chat.id.user, 1, "caklontong");
                if (game.status) {
                    const caklontong = await games.caklontong(chat.id.user);
                    message.reply(caklontong.text);
                    if (!caklontong.play) return;
                    games.timer(chat.id.user, chat, "caklontong");
                } else {
                    message.reply(game.msg);
                }
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
        //caklontong
        //tebakkata
    } else if (message.body === "-tebakkata") {
        if (chat.isGroup) {
            try {
                const game = status.setStatus(chat.id.user, 1, "tebakkata");
                if (game.status) {
                    const tebakkata = await games.tebakkata(chat.id.user);
                    message.reply(tebakkata.text);
                    if (!tebakkata.play) return;
                    games.timer(chat.id.user, chat, "tebakkata");
                } else {
                    message.reply(game.msg);
                }
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
        //tebakkata
        //tebaklirik
    } else if (message.body === "-tebaklirik") {
        if (chat.isGroup) {
            try {
                const game = status.setStatus(chat.id.user, 1, "tebaklirik");
                if (game.status) {
                    const tebaklirik = await games.tebaklirik(chat.id.user);
                    message.reply(tebaklirik.text);
                    if (!tebaklirik.play) return;
                    games.timer(chat.id.user, chat, "tebaklirik");
                } else {
                    message.reply(game.msg);
                }
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
        //tebaklirik
        //tebakkalimat
    } else if (message.body === "-tebakkalimat") {
        if (chat.isGroup) {
            try {
                const game = status.setStatus(chat.id.user, 1, "tebakkalimat");
                if (game.status) {
                    const tebakkalimat = await games.tebakkalimat(chat.id.user);
                    message.reply(tebakkalimat.text);
                    if (!tebakkalimat.play) return;
                    games.timer(chat.id.user, chat, "tebakkalimat");
                } else {
                    message.reply(game.msg);
                }
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
        //tebakkalimat
    } else if (message.body === "-stop") {
        if (chat.isGroup) {
            message.reply(
                "to stop a game, type *-stop* 'gamecode'.\ntype *-help* to see valid commands.\n\ntype *-gamecodes* to view available gamecode"
            );
        } else {
            group(message);
        }
    } else if (message.body.startsWith("-stop ")) {
        if (chat.isGroup) {
            try {
                const game = status.setStatus(
                    chat.id.user,
                    0,
                    message.body.split(" ")[1]
                );
                message.reply(game.msg);
                if (game.status) {
                    if (game.game == "fam") {
                        fam.delSoal(chat.id.user);
                    } else if (game.game == "lontong") {
                        lontong.delSoal(chat.id.user);
                    } else if (game.game == "caklontong") {
                        games.destroy(chat.id.user, "caklontong");
                    } else if (game.game == "tebakkata") {
                        games.destroy(chat.id.user, "tebakkata");
                    } else if (game.game == "tebaklirik") {
                        games.destroy(chat.id.user, "tebaklirik");
                    } else if (game.game == "tebakkalimat") {
                        games.destroy(chat.id.user, "tebakkalimat");
                    }
                }
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
    } else if (message.body === "-qdd") {
        message.reply(
            "to add a question, type *-qdd* followed by the following format.\n\n-qdd\n\n'gamecode'\n\ntype *-gamecodes* to view available gamecode"
        );
    } else if (message.body.startsWith("-qdd")) {
        let [cmd, game, ...msg] = message.body.split("\n\n");
        if (game == "fam") {
            message.reply(fam.writeSoal(msg));
        } else if (game == "lontong") {
            message.reply(lontong.writeSoal(msg));
        } else {
            message.reply("this gamecode not available to add new question.");
        }
    } else if (message.body === "-gamecodes") {
        let gcs = "*available gamecodes*\n";
        gamecodes.forEach((gc) => {
            gcs += `\n-${gc}`;
        });
        if (!gamecodes.length) gcs += "\nnone";
        gcs += "\n\ntype *-menu* to view full menu.";
        message.reply(gcs);
    } else if (message.body === "-lb") {
        if (chat.isGroup) {
            try {
                const { text, mentions } = lb.getLB(chat.id.user);
                chat.sendMessage(text, { mentions });
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
    } else if (message.body.startsWith("-")) {
        const cmd = message.body.split("-")[1].toLowerCase();
        let char = message.body.split("-")[2];
        if (!char && qtmsg) char = qtmsg.body;
        let nocmd = true;
        stickersCmd.forEach((el) => {
            if (el.toLowerCase() == cmd) {
                nocmd = false;
                return stickers.generate(cmd, message, MessageMedia);
            }
        });
        if (char) {
            emojisCmd.forEach((el) => {
                if (el.toLowerCase() == cmd) {
                    nocmd = false;
                    return stickers.emoji(cmd, char, message, MessageMedia);
                }
            });
        }
        if (nocmd)
            message.reply(
                "command not valid. type *-help* or *-menu* to see valid commands."
            );
    } else {
        if (chat.isGroup) {
            try {
                const game = status.getStatus(chat.id.user);
                if (game.status) {
                    if (Object.values(game.game).indexOf("fam") > -1) {
                        const soal = fam.getSoal(chat.id.user);
                        if (!soal.play) return fam.setStatus(chat.id.user, 0);

                        for (let i = 0; i < soal.answer.length; i++) {
                            if (
                                soal.answer[i].toLowerCase() ===
                                message.body.toLowerCase()
                            ) {
                                let extra = "";
                                let contact = await client.getContactById(
                                    message.author
                                );
                                lb.setLB(
                                    chat.id.user,
                                    {
                                        user: `@${
                                            message.author.split("@")[0]
                                        }`,
                                        contact,
                                    },
                                    soal.reward
                                );
                                if (soal.answer.length == 1) {
                                    extra = `great! game has been completed.\ntype *-lb* to see leaderboard.`;
                                    fam.setStatus(chat.id.user, 0);
                                    fam.delSoal(chat.id.user);
                                } else {
                                    soal.answer.splice(i, 1);
                                    extra = `*${soal.answer.length} answer(s) left*`;
                                    fam.upSoal(soal);
                                }
                                message.reply(
                                    `*FAMILY100*\n\nright answer. +${soal.reward} point.\n\n${extra}`
                                );
                            }
                        }
                    }
                    if (Object.values(game.game).indexOf("lontong") > -1) {
                        const soal = lontong.getSoal(chat.id.user);
                        if (!soal.play)
                            return lontong.setStatus(chat.id.user, 0);
                        if (
                            soal.answer.toLowerCase() ===
                            message.body.toLowerCase()
                        ) {
                            message.reply(
                                `*QUIZ LONTONG*\n\nright answer. +${soal.reward} point.\ntype *-lb* to see leaderboard.`
                            );
                            lontong.setStatus(chat.id.user, 0);
                            lontong.delSoal(chat.id.user);
                            let contact = await client.getContactById(
                                message.author
                            );
                            lb.setLB(
                                chat.id.user,
                                {
                                    user: `@${message.author.split("@")[0]}`,
                                    contact,
                                },
                                soal.reward
                            );
                        }
                    }
                    if (Object.values(game.game).indexOf("caklontong") > -1) {
                        const soal = games.getAnsWard(
                            chat.id.user,
                            "caklontong"
                        );

                        if (
                            soal.answer.toLowerCase() ===
                            message.body.toLowerCase()
                        ) {
                            message.reply(
                                `*CAK LONTONG*\n\nright answer. +${
                                    soal.reward
                                } point.\n\ndesc : ${soal.desc.toLowerCase()}`
                            );
                            status.setStatus(chat.id.user, 0, "caklontong");
                            games.destroy(chat.id.user, "caklontong");
                            let contact = await client.getContactById(
                                message.author
                            );
                            lb.setLB(
                                chat.id.user,
                                {
                                    user: `@${message.author.split("@")[0]}`,
                                    contact,
                                },
                                soal.reward
                            );
                        }
                    }
                    if (Object.values(game.game).indexOf("tebakkata") > -1) {
                        const soal = games.getAnsWard(
                            chat.id.user,
                            "tebakkata"
                        );

                        if (
                            soal.answer.toLowerCase() ===
                            message.body.toLowerCase()
                        ) {
                            message.reply(
                                `*TEBAK KATA*\n\nright answer. +${soal.reward} point.`
                            );
                            status.setStatus(chat.id.user, 0, "tebakkata");
                            games.destroy(chat.id.user, "tebakkata");
                            let contact = await client.getContactById(
                                message.author
                            );
                            lb.setLB(
                                chat.id.user,
                                {
                                    user: `@${message.author.split("@")[0]}`,
                                    contact,
                                },
                                soal.reward
                            );
                        }
                    }
                    if (Object.values(game.game).indexOf("tebaklirik") > -1) {
                        const soal = games.getAnsWard(
                            chat.id.user,
                            "tebaklirik"
                        );

                        if (
                            soal.answer.toLowerCase() ===
                            message.body.toLowerCase()
                        ) {
                            message.reply(
                                `*TEBAK LIRIK*\n\nright answer. +${soal.reward} point.`
                            );
                            status.setStatus(chat.id.user, 0, "tebaklirik");
                            games.destroy(chat.id.user, "tebaklirik");
                            let contact = await client.getContactById(
                                message.author
                            );
                            lb.setLB(
                                chat.id.user,
                                {
                                    user: `@${message.author.split("@")[0]}`,
                                    contact,
                                },
                                soal.reward
                            );
                        }
                    }
                    if (Object.values(game.game).indexOf("tebakkalimat") > -1) {
                        const soal = games.getAnsWard(
                            chat.id.user,
                            "tebakkalimat"
                        );

                        if (
                            soal.answer.toLowerCase() ===
                            message.body.toLowerCase()
                        ) {
                            message.reply(
                                `*TEBAK KALIMAT*\n\nright answer. +${soal.reward} point.`
                            );
                            status.setStatus(chat.id.user, 0, "tebakkalimat");
                            games.destroy(chat.id.user, "tebakkalimat");
                            let contact = await client.getContactById(
                                message.author
                            );
                            lb.setLB(
                                chat.id.user,
                                {
                                    user: `@${message.author.split("@")[0]}`,
                                    contact,
                                },
                                soal.reward
                            );
                        }
                    }
                }
            } catch (err) {
                error(message, err);
            }
        }
    }
});

client.initialize();

io.on("connection", (socket) => {
    // client.on("qr", (qr) => {
    //     qrcode.generate(qr, { small: true });
    // });
    socket.emit("message", "Connecting...");

    client.on("qr", (qr) => {
        console.log("QR RECEIVED", qr);
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            socket.emit("message", "QR Code received, scan please!");
        });
    });

    client.on("ready", () => {
        console.log("ready");
        socket.emit("ready", "Whatsapp is ready!");
        socket.emit("message", "Whatsapp is ready!");
    });

    client.on("authenticated", () => {
        console.log("authenticated");
        socket.emit("authenticated", "Whatsapp is authenticated!");
        socket.emit("message", "Whatsapp is authenticated!");
        console.log("AUTHENTICATED");
    });

    client.on("auth_failure", function (session) {
        console.log("auth_failure");
        socket.emit("message", "Auth failure, restarting...");
    });

    client.on("disconnected", (reason) => {
        console.log("disconnected");
        socket.emit("message", "Whatsapp is disconnected!");
        client.destroy();
        client.initialize();
    });
});

server.listen(process.env.PORT || 3000, function () {
    console.log("App running");
});

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fam = require("./controllers/db/fam");
const lontong = require("./controllers/db/lontong");
const gamecodes = ["fam", "lontong"];
const lb = require("./controllers/db/lb");
const status = require("./controllers/db/status");
const {
    group,
    error,
    errai,
    autoBot,
    sticker,
    img,
} = require("./controllers/utils/autoMsg");
const { ai, tlid, tlen, stden } = require("./controllers/api/ai");
const { cnn, base } = require("./controllers/api/berita");
const { spec, speq, spek, speb, specs } = require("./controllers/api/spec");

const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
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
    },
    authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");
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
            let qtmsg = await message.getQuotedMessage();
            let text =
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

            await chat.sendMessage(text, { mentions });
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
                    fam.timer(chat.id.user, chat);
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
                    lontong.timer(chat.id.user, chat);
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
                if (game.status) {
                    if (game.game == "fam") {
                        message.reply(game.msg);
                        fam.end(chat.id.user, chat);
                    } else if (game.game == "lontong") {
                        message.reply(game.msg);
                        lontong.end(chat.id.user, chat);
                    }
                } else {
                    message.reply(game.msg);
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
            message.reply(
                "to add a question, type *-qdd* followed by the following format.\n\n-qdd\n\n'gamecode'\n\ntype *-gamecodes* to view available gamecode"
            );
        }
    } else if (message.body === "-gamecodes") {
        let gcs = "*available gamecodes*\n";
        gamecodes.forEach((gc) => {
            gcs += `\n${gc}`;
        });
        if (!gamecodes.length) gcs += "none";
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
                                soal.answer.splice(i, 1);
                                message.reply(
                                    `right answer. your point +${soal.reward}.\n\n*${soal.answer.length} answer(s) left*`
                                );
                                if (soal.answer.length == 0) {
                                    chat.sendMessage(
                                        `great! game has been completed.\ntype *-lb* to see leaderboard.`
                                    );
                                    fam.setStatus(chat.id.user, 0);
                                    return fam.delSoal(chat.id.user);
                                }
                                fam.upSoal(soal);
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
                            message.reply(
                                `right answer. your point +${soal.reward}.\n\ngreat! game has been completed.\ntype *-lb* to see leaderboard.`
                            );
                            lontong.setStatus(chat.id.user, 0);
                            return lontong.delSoal(chat.id.user);
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

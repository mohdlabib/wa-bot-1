const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
require("dotenv").config();
const express = require("express");
const socket = require("socket.io");
const qrcode = require("qrcode");
const http = require("http");
const fam = require("./controllers/games/fam");
const lontong = require("./controllers/games/lontong");
const gamecodes = [
    "fam",
    "lontong",
    "caklontong",
    "tebakkata",
    "tebaklirik",
    "tebakkalimat",
    "tekateki",
];
const mks = ["sd", "asd", "bing", "arsikom", "md", "imk", "ep", "sm"];
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
    jadwalkuliah,
    getKW,
    setKW,
    delKW,
    upKW,
    addTask,
    delTask,
    getTask,
} = require("./controllers/utils/autoMsg");
const { ai, tlid, tlen, stden } = require("./controllers/api/ai");
const { cnn, base } = require("./controllers/api/berita");
const { spec, speq, spek, speb, specs } = require("./controllers/api/spec");
const stickers = require("./controllers/api/stickers");
const { salat, doa } = require("./controllers/api/salat");
const { ytaudio, yt, tt, ig } = require("./controllers/api/downloader");
const { json } = require("express");
const {
    AlphaKey,
    AlphaCount,
    PremiumList,
} = require("./controllers/utils/apikey");
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

const port = process.env.PORT || 3020;

const client = new Client({
    restartOnAuthFail: true,
    ffmpeg: "./ffmpeg",
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
        // executablePath: "/usr/bin/google-chrome-stable",
        executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    },
    authStrategy: new LocalAuth(),
});

const app = express();
const server = http.createServer(app);
const io = socket(server);
const owner = "6282286230830@c.us";

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    var apikey = req.query.apikey;

    if (apikey === "2117102004") {
        res.sendfile("public/index.html", {
            root: __dirname,
        });
    } else {
        res.send("403");
    }
});

if (new Date().getHours == 0) {
    AlphaCount(0, "all", "all");
}

client.on("message", async (message) => {
    // console.log(message.body);
    // console.log(message);
    let chat = await message.getChat();
    let contact = await client.getContactById(message.author || message.from);
    let user = contact.id._serialized;
    await chat.sendSeen();
    // if (!contact.isMyContact && message.body.startsWith("-")) {
    // const mentions = [await client.getContactById(owner)];
    //     message.reply(
    //         "Maaf, bot sedang maintenance. Upgrade ke premium untuk ikut mencoba bot saat maintenance. Hubungi owner bot, @"+mentions[0].id.user+".", {mentions}
    //     );
    //     return;
    // }
    let qtmsg = null;
    try {
        if (message.hasQuotedMsg) qtmsg = await message.getQuotedMessage();
    } catch (error) {
        console.log("failed get quoted message");
    }
    if (message.body.startsWith("-resetlimit")) {
        AlphaCount(0, -1, message.body.split(" ")[1]);
        message.reply(
            "limit user " + message.body.split(" ")[1] + " sudah di reset."
        );
        return;
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
                `*Detail Grup*\nNama\t: ${chat.name}\nDeskripsi\t: ${
                    chat.description
                }\nDibuat Pada\t: ${chat.createdAt.toString()}\nDibuat Oleh\t: ${
                    chat.owner ? chat.owner.user : "admin"
                }\nJumlah Anggota\t: ${chat.participants.length}`
            );
        } else {
            group(message);
        }
    } else if (message.body === "-sticker" || message.body == "-s") {
        sticker(message, qtmsg, MessageMedia);
    } else if (message.body.startsWith("-smeme")) {
        const text = message.body.slice("-smeme ".length).split("|");
        if (text.length < 1)
            return message.reply(
                "format salah. ketik *-smeme* TEKS ATAS|TEKS BAWAH|JARAK TEKS DENGAN ATAS BAWAH GAMBAR|UKURAN FONT untuk membuat stiker dengan teks (meme).\n\nketik *-help* untuk melihat bantuan."
            );
        sticker(
            message,
            qtmsg,
            MessageMedia,
            text[0],
            text[1],
            Number(text[2]),
            Number(text[3])
        );
    } else if (message.body === "-limit") {
        let limit = AlphaCount(0, 0, user);
        message.reply(
            "limit user " + limit.name.split("|")[1] + " -> " + limit.hit
        );
    } else if (
        message.body === "-premiumlist" ||
        message.body === "-listpremium"
    ) {
        let premium = PremiumList();
        let prm = "*List User Premium Funday Bot*\n",
            no = 1,
            mentions = [];
        for (const pr of premium) {
            for (const p of pr.user) {
                const contact = await client.getContactById(p);
                prm += `\n${no++}. @${contact.id.user}`;
                mentions.push(contact);
            }
        }
        if (!premium.length) prm += "\nTidak ada User Premium";
        prm +=
            "\n\n*NB :* ketik *-jadipremium* atau *-addpremium* atau *-premium* untuk daftar jadi User Premium.";
        await message.reply(prm, message.from, {
            mentions,
        });
    } else if (
        message.body === "-premium" ||
        message.body === "-addpremium" ||
        message.body === "-jadipremium"
    ) {
        const mentions = [await client.getContactById(owner)];
        await message.reply(
            `Upgrade ke premium dengan harga terjangkau.\n\n*List Paket Premium Funday Bot*\n1. 5k/bulan -> 350 perintah (downloader, stiker random, emoji ke stiker, dan games)/hari\n2. 10k/bulan -> 1000 perintah (downloader, stiker random, emoji ke stiker, dan games)/hari\n3. 15k/bulan -> 1750 perintah (downloader, stiker random, emoji ke stiker, dan games)/hari\n4. 20k/bulan -> 3000 perintah (downloader, stiker random, emoji ke stiker, dan games)/hari\n5. 25k/bulan -> 7500 perintah (downloader, stiker random, emoji ke stiker, dan games)/hari\n6. Donasi seikhlasnya -> 100-200 perintah (downloader, stiker random, emoji ke stiker, dan games)/hari\n\nTertarik? Hubungi owner bot, @${mentions[0].id.user}.`,
            message.from,
            { mentions }
        );
    } else if (message.body === "-stickers") {
        let gcs = "*stiker random yang tersedia*\n";
        stickersCmd.forEach((gc) => {
            gcs += `\n-${gc.toLowerCase()}`;
        });
        if (!stickersCmd.length) gcs += "\nnone";
        gcs +=
            "\n\nketik *-menu* untuk melihat semua menu.\nketik *-help* untuk melihat bantuan.";
        message.reply(gcs);
    } else if (message.body === "-emojis") {
        let gcs = "*platform emoji ke stiker yang tersedia*\n";
        emojisCmd.forEach((gc) => {
            gcs += `\n-${gc.toLowerCase()}`;
        });
        if (!emojisCmd.length) gcs += "\nnone";
        gcs +=
            "\n\nperintah :\n-platform-emoji\nganti 'emoji' dengan emoji yang ingin dibuat stiker\n\nketik *-menu* untuk melihat semua menu.\nketik *-help* untuk melihat bantuan.";
        message.reply(gcs);
    } else if (message.body === "-mks") {
        let gcs = "*available matakuliah for task TI-B UR 22*\n";
        mks.forEach((gc) => {
            gcs += `\n-${gc.toLowerCase()}`;
        });
        if (!emojisCmd.length) gcs += "\nnone";
        gcs += "\n\nketik *-menu* untuk melihat semua menu.";
        message.reply(gcs);
    } else if (message.body === "-img" || message.body == "-toimg") {
        img(message, qtmsg, MessageMedia);
    } else if (message.body.startsWith("-meme")) {
        const text = message.body.slice("-meme ".length).split("|");
        if (text.length <= 1)
            return message.reply(
                "format salah. ketik *-meme* TEKS ATAS|TEKS BAWAH|JARAK TEKS DENGAN ATAS BAWAH GAMBAR|UKURAN FONT untuk membuat teks di gambar (meme).\n\nketik *-help* untuk melihat bantuan."
            );
        img(
            message,
            qtmsg,
            MessageMedia,
            text[0],
            text[1],
            Number(text[2]),
            Number(text[3])
        );
    } else if (message.body === "-help") {
        autoBot("help.txt", message);
    } else if (message.body === "-menu") {
        autoBot("menu.txt", message);
    } else if (
        message.body.startsWith("-jadwalkuliah") ||
        message.body.startsWith("-jk")
    ) {
        const hari = message.body.split(" ")[1];
        if (!hari)
            return message.reply(
                "format salah. ketik *-jadwalkuliah* 'hari' atau *-jk* 'hari' untuk melihat Jadwal Kuliah TI-B Semester 2."
            );
        jadwalkuliah(hari.toLowerCase(), message);
    } else if (message.body.startsWith("-addtask")) {
        const cmd = message.body.split("+");
        if (cmd.length != 4)
            return message.reply(
                "format salah. ketik *-addtask* 'class' 'mk' 'task1,task2' untuk add task list."
            );
        addTask(
            cmd[1].toLowerCase(),
            cmd[2].toLowerCase(),
            cmd[3].split(","),
            message
        );
    } else if (message.body.startsWith("-deltask")) {
        const cmd = message.body.split("+");
        if (cmd.length != 4)
            return message.reply(
                "format salah. ketik *-deltask* 'class' 'mk' 'task1,task2' untuk delete task list."
            );
        delTask(
            cmd[1].toLowerCase(),
            cmd[2].toLowerCase(),
            cmd[3].split(","),
            message
        );
    } else if (message.body.startsWith("-viewtask")) {
        const cmd = message.body.split("+");
        if (cmd.length != 3)
            return message.reply(
                "format salah. ketik *-viewtask* 'class' 'mk' untuk view task list."
            );
        getTask(cmd[1].toLowerCase(), cmd[2].toLowerCase(), message);
    } else if (message.body.startsWith("-addtb")) {
        const cmd = message.body.split("+");
        if (cmd.length != 3)
            return message.reply(
                "format salah. ketik *-addtb* 'mk' 'task1,task2' untuk add task list for TI-B UR 22."
            );
        addTask("ti-b", cmd[1].toLowerCase(), cmd[2].split(","), message);
    } else if (message.body.startsWith("-deltb")) {
        const cmd = message.body.split("+");
        if (cmd.length != 3)
            return message.reply(
                "format salah. ketik *-deltb* 'mk' 'task1,task2' untuk delete task list for TI-B UR 22."
            );
        delTask("ti-b", cmd[1].toLowerCase(), cmd[2].split(","), message);
    } else if (message.body.startsWith("-vtb")) {
        const cmd = message.body.split("+");
        if (cmd.length != 2)
            return message.reply(
                "format salah. ketik *-vtb* 'mk' untuk view task list for TI-B UR 22."
            );
        getTask("ti-b", cmd[1].toLowerCase(), message);
    } else if (
        message.body.startsWith("-solat") ||
        message.body.startsWith("-salat") ||
        message.body.startsWith("-shalat")
    ) {
        const kota = message.body.split(" ")[1];
        if (!kota)
            return message.reply(
                "format salah. ketik *-solat* atau *-shalat* 'kota' (tanpa tanda kutip) untuk melihat Jadwal Solat hari ini.\n\nketik *-help* untuk melihat bantuan."
            );
        salat(kota.toLowerCase(), message);
    } else if (message.body === "-spku") {
        salat("pekanbaru", message);
    } else if (message.body.startsWith("-doa")) {
        const doaa = message.body.slice("-doa ".length);
        if (!doaa)
            return message.reply(
                "format salah. ketik *-doa* 'nama doa' (tanpa tanda kutip) untuk mencari Doa.\n\nketik *-help* untuk melihat bantuan."
            );
        doa(doaa.toLowerCase(), message);
    } else if (message.body.startsWith("-ytaudio")) {
        let url = message.body.split(" ")[1];
        if (!url && !qtmsg)
            return message.reply(
                "format salah. ketik *-ytaudio* 'url yt' (tanpa tanda kutip) untuk download audio dari YouTube.\n\nketik *-help* untuk melihat bantuan."
            );
        if (qtmsg && !url) url = qtmsg.body;
        ytaudio(url, message, MessageMedia, chat, user);
    } else if (
        message.body.startsWith("-yt") ||
        message.body.startsWith("-ytvid")
    ) {
        let url = message.body.split(" ")[1];
        if (!url && !qtmsg)
            return message.reply(
                "format salah. ketik *-ytvid* 'url yt' (tanpa tanda kutip) untuk download video dari YouTube.\n\nketik *-help* untuk melihat bantuan."
            );
        if (qtmsg && !url) url = qtmsg.body;
        yt(url, message, MessageMedia, chat, user);
    } else if (
        message.body.startsWith("-tt") ||
        message.body.startsWith("-tiktok")
    ) {
        let url = message.body.split(" ")[1];
        if (!url && !qtmsg)
            return message.reply(
                "format salah. ketik *-tt* 'url tiktok' (tanpa tanda kutip) untuk download video dan audio dari TikTok.\n\nketik *-help* untuk melihat bantuan."
            );
        if (qtmsg && !url) url = qtmsg.body;
        tt(url, message, user);
    } else if (message.body.startsWith("-ig")) {
        let url = message.body.split(" ")[1];
        if (!url && !qtmsg)
            return message.reply(
                "format salah. ketik *-ig* 'url ig' (tanpa tanda kutip) untuk download video dari Instagram.\n\nketik *-help* untuk melihat bantuan."
            );
        if (qtmsg && !url) url = qtmsg.body;
        ig(url, message, MessageMedia, user);
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
                await chat.sendMessage(text, {
                    mentions,
                });
            else
                await chat.sendMessage("@everyone", {
                    mentions,
                });
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

            message.reply(text, message.from, {
                mentions,
            });
        } else {
            group(message);
        }
    } else if (message.body.startsWith("-addkw ")) {
        const text = message.body.slice("-addkw ".length);
        const [kw, rp] = text.split("|");
        if (!kw || !rp)
            return message.reply(
                "format salah. ketik *-addkw* keyword|balasan untuk menambah keyword baru."
            );
        setKW(kw.toLowerCase(), rp, message);
    } else if (message.body.startsWith("-upkw ")) {
        const text = message.body.slice("-upkw ".length);
        const [kw, rp] = text.split("|");
        if (!kw || !rp)
            return message.reply(
                "format salah. ketik *-upkw* keyword|balasan untuk edit keyword."
            );
        upKW(kw.toLowerCase(), rp, message);
    } else if (message.body.startsWith("-delkw ")) {
        const text = message.body.slice("-delkw ".length);
        if (!text)
            return message.reply(
                "format salah. ketik *-delkw* 'keyword' (tanpa tanda kutip) untuk hapus keyword."
            );
        delKW(text.toLowerCase(), message);
    } else if (
        message.body === "-bot" ||
        (message.body.toLowerCase() === "p" && !chat.isGroup)
    ) {
        message.reply(
            "halo, aku Funday. ketik *-menu* untuk melihat semua menu. jika ada kesulitan lihat bantuan di *-help* atau hubungi owner bot ini."
        );

        //AI
    } else if (message.body === "-ai" || message.body === "-t") {
        if (!qtmsg) {
            return message.reply(
                "halo, aku Funday. ketik atau balas pesan dengan *-ai* atau *-t* untuk berbicara denganku.\n\naku bisa semua bahasa loh, jadi tanya sesukamu yaa."
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
                "halo, aku Funday. ketik atau balas pesan dengan *-tlid* untuk translate ke bahasa indonesia."
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
                "halo, aku Funday. ketik atau balas pesan dengan *-tlen* untuk translate ke english."
            );
        }
        tlen(qtmsg.body, qtmsg);
    } else if (message.body.startsWith("-tlen ")) {
        tlen(message.body.slice("-tlen ".length), message);
    } else if (message.body === "-stden") {
        if (!qtmsg) {
            return message.reply(
                "halo, aku Funday. ketik atau balas pesan dengan *-stden* untuk membenarkan kalimat ke Grammatical Standard English."
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
                    const caklontong = await games.caklontong(
                        chat.id.user,
                        user
                    );
                    message.reply(caklontong.text);
                    if (!caklontong.play) {
                        status.setStatus(chat.id.user, 0, "caklontong");
                        return;
                    }
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
                    const tebakkata = await games.tebakkata(chat.id.user, user);
                    message.reply(tebakkata.text);
                    if (!tebakkata.play) {
                        status.setStatus(chat.id.user, 0, "tebakkata");
                        return;
                    }
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
        //tekateki
    } else if (message.body === "-tekateki") {
        if (chat.isGroup) {
            try {
                const game = status.setStatus(chat.id.user, 1, "tekateki");
                if (game.status) {
                    const tekateki = await games.tekateki(chat.id.user, user);
                    message.reply(tekateki.text);
                    if (!tekateki.play) {
                        status.setStatus(chat.id.user, 0, "tekateki");
                        return;
                    }
                    games.timer(chat.id.user, chat, "tekateki");
                } else {
                    message.reply(game.msg);
                }
            } catch (err) {
                error(message, err);
            }
        } else {
            group(message);
        }
        //tekateki
        //tebaklirik
    } else if (message.body === "-tebaklirik") {
        if (chat.isGroup) {
            try {
                const game = status.setStatus(chat.id.user, 1, "tebaklirik");
                if (game.status) {
                    const tebaklirik = await games.tebaklirik(
                        chat.id.user,
                        user
                    );
                    message.reply(tebaklirik.text);
                    if (!tebaklirik.play) {
                        status.setStatus(chat.id.user, 0, "tebaklirik");
                        return;
                    }
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
                    const tebakkalimat = await games.tebakkalimat(
                        chat.id.user,
                        user
                    );
                    message.reply(tebakkalimat.text);
                    if (!tebakkalimat.play) {
                        status.setStatus(chat.id.user, 0, "tebakkalimat");
                        return;
                    }
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
                "untuk menghentikan game, ketik *-stop* 'gamecode' (tanpa tanda kutip).\nketik *-help* untuk melihat bantuan.\n\nketik *-gamecodes* untuk melihat gamecode yang tersedia."
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
            "untuk menambah soal, ketik *-qdd* dengan format berikut.\n\n-qdd\n\n'gamecode' (tanpa tanda kutip)\n\nketik *-gamecodes* untuk melihat gamecode yang tersedia."
        );
    } else if (message.body.startsWith("-qdd")) {
        let [cmd, game, ...msg] = message.body.split("\n\n");
        if (game == "fam") {
            message.reply(fam.writeSoal(msg));
        } else if (game == "lontong") {
            message.reply(lontong.writeSoal(msg));
        } else {
            message.reply("gamecode ini tidak bisa ditambahkan soalnya.");
        }
    } else if (message.body === "-gamecodes") {
        let gcs = "*gamecode yang tersedia*\n";
        gamecodes.forEach((gc) => {
            gcs += `\n-${gc}`;
        });
        if (!gamecodes.length) gcs += "\nnone";
        gcs += "\n\nketik *-menu* untuk melihat semua menu.";
        message.reply(gcs);
    } else if (message.body === "-lb") {
        if (chat.isGroup) {
            try {
                const { text, mentions } = lb.getLB(chat.id.user);
                chat.sendMessage(text, {
                    mentions,
                });
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
                return stickers.generate(cmd, message, MessageMedia, user);
            }
        });
        if (char) {
            emojisCmd.forEach((el) => {
                if (el.toLowerCase() == cmd) {
                    nocmd = false;
                    return stickers.emoji(
                        cmd,
                        char,
                        message,
                        MessageMedia,
                        user
                    );
                }
            });
        }
        if (nocmd)
            message.reply(
                "perintah tidak valid. ketik *-menu* untuk melihat menu. untuk melihat bantuan, ketik *-help* atau hubungi owner bot."
            );
    } else {
        getKW(message.body.toLowerCase(), message);
        if (chat.isGroup) {
            try {
                //gameon
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
                                    extra = `hebat! game telah selesai.\n\nketik *-lb* untuk melihat leaderboard.`;
                                    fam.setStatus(chat.id.user, 0);
                                    fam.delSoal(chat.id.user);
                                } else {
                                    soal.answer.splice(i, 1);
                                    extra = `*${soal.answer.length} jawaban tersisa*`;
                                    fam.upSoal(soal);
                                }
                                message.reply(
                                    `*FAMILY100*\n\njawaban benar. +${soal.reward} point.\n\n${extra}`
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
                                `*QUIZ LONTONG*\n\njawaban benar. +${soal.reward} point.\n\nketik *-lb* untuk melihat leaderboard.`
                            );
                            lontong.setStatus(chat.id.user, 0);
                            lontong.delSoal(chat.id.user);
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
                                `*CAK LONTONG*\n\njawaban benar. +${
                                    soal.reward
                                } point.\n\ndeskripsi : ${soal.desc.toLowerCase()}`
                            );
                            status.setStatus(chat.id.user, 0, "caklontong");
                            games.destroy(chat.id.user, "caklontong");
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
                                `*TEBAK KATA*\n\njawaban benar. +${soal.reward} point.`
                            );
                            status.setStatus(chat.id.user, 0, "tebakkata");
                            games.destroy(chat.id.user, "tebakkata");
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
                    if (Object.values(game.game).indexOf("tekateki") > -1) {
                        const soal = games.getAnsWard(chat.id.user, "tekateki");

                        if (
                            soal.answer.toLowerCase() ===
                            message.body.toLowerCase()
                        ) {
                            message.reply(
                                `*TEKATEKI*\n\njawaban benar. +${soal.reward} point.`
                            );
                            status.setStatus(chat.id.user, 0, "tekateki");
                            games.destroy(chat.id.user, "tekateki");
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
                                `*TEBAK LIRIK*\n\njawaban benar. +${soal.reward} point.`
                            );
                            status.setStatus(chat.id.user, 0, "tebaklirik");
                            games.destroy(chat.id.user, "tebaklirik");
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
                                `*TEBAK KALIMAT*\n\njawaban benar. +${soal.reward} point.`
                            );
                            status.setStatus(chat.id.user, 0, "tebakkalimat");
                            games.destroy(chat.id.user, "tebakkalimat");
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

// Socket IO
io.on("connection", function (socket) {
    socket.emit("message", "Connecting...");

    client.on("qr", (qr) => {
        console.log("QR RECEIVED", qr);
        qrcode.toDataURL(qr, (err, url) => {
            socket.emit("qr", url);
            socket.emit("message", "QR Code received, scan please!");
        });
    });

    client.on("ready", () => {
        socket.emit("ready", "Whatsapp is ready!");
        socket.emit("message", "Whatsapp is ready!");
    });

    client.on("authenticated", () => {
        socket.emit("authenticated", "Whatsapp is authenticated!");
        socket.emit("message", "Whatsapp is authenticated!");
        console.log("AUTHENTICATED");
    });

    client.on("auth_failure", function (session) {
        socket.emit("message", "Auth failure, restarting...");
    });

    client.on("disconnected", (reason) => {
        socket.emit("message", "Whatsapp is disconnected!");
        client.destroy();
        client.initialize();
    });
});

server.listen(port, function () {
    console.log("App running on :" + port);
});

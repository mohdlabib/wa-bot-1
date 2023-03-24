const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
require("dotenv").config();

const DonationController = require("./controllers/utils/pay");
const express = require("express");
const socket = require("socket.io");
const qrcode = require("qrcode");
const http = require("http");
const bodyParser = require("body-parser");
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
    "tebakbendera",
    "susunkata",
    "asahotak",
    "tebakkimia",
    "siapakahaku",
    "tebaktebakan",
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
    wait,
} = require("./controllers/utils/autoMsg");
const { ai, tlid, tlen, stden } = require("./controllers/api/ai");
const { cnn, base } = require("./controllers/api/berita");
const { spec, speq, spek, speb, specs } = require("./controllers/api/spec");
const stickers = require("./controllers/api/stickers");
const {
    salat,
    doa,
    surah,
    quran,
    tafsir,
    taugasih,
    imsak,
    doa2,
} = require("./controllers/api/salat");
const { ytaudio, yt, tt, ig, play } = require("./controllers/api/downloader");
const { json } = require("express");
const {
    AlphaPremiumList,
    refreshAlphaUser,
    AlphaLimit,
    newAlphaUser,
    changeAlphaUser,
    AlphaKey,
} = require("./controllers/utils/apikey");
const { join } = require("path");
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
        // for Ubuntu
        executablePath: "/usr/bin/google-chrome-stable",
        // for Windows
        // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
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

    if (apikey === "12344321") {
        res.sendFile("public/index.html", {
            root: __dirname,
        });
    } else {
        res.send("403");
    }
});

client.on("message", async (message) => {
    try {

        let chat = await message.getChat();
        let contact = await client.getContactById(
            message.author || message.from
        );
        let user = contact.id._serialized;
        refreshAlphaUser(user);
        newAlphaUser(user, 10);
        await chat.sendSeen();
        // if (!contact.isMyContact && message.body.startsWith("-")) {
        //     const mentions = [await client.getContactById(owner)];
        //     message.reply(
        //         "Maaf, bot sedang maintenance. Upgrade ke premium untuk ikut mencoba bot saat maintenance. Hubungi owner bot, @" +
        //             mentions[0].id.user +
        //             ".",
        //         message.from,
        //         { mentions }
        //     );
        //     return;
        // }
        let qtmsg = null;
        try {
            if (message.hasQuotedMsg) qtmsg = await message.getQuotedMessage();
        } catch (error) {
            console.log("failed get quoted message");
        }

        //API
        //spesifikasi
        if (
            message.body == "-spec" ||
            message.body == "-spek" ||
            message.body == "-speq"
        ) {
            if (!qtmsg) {
                message.reply(
                    "Format salah. Kirim atau balas keyword/namaHP/keywordHP dengan perintah *-speq* atau *-spec* atau *-spek*.\n\nKetik *-help* untuk melihat bantuan."
                );
                return;
            }
            wait(message, 2);
            specs(message.body, qtmsg.body, qtmsg, MessageMedia, chat);
        } else if (message.body.startsWith("-spec ")) {
            wait(message, 2);
            spec(
                message.body.slice("-spec ".length),
                message,
                MessageMedia,
                chat
            );
        } else if (message.body.startsWith("-spek ")) {
            wait(message, 2);
            spek(
                message.body.slice("-spek ".length),
                message,
                MessageMedia,
                chat
            );
        } else if (message.body.startsWith("-speq ")) {
            wait(message, 2);
            speq(message.body.slice("-speq ".length), message);
            //spesifikasi
            //berita
        } else if (message.body == "-cnn") {
            message.reply(
                "Format salah. Kirim KategoriBerita dengan perintah *-cnn*.\n\nKetik *-help* untuk melihat bantuan."
            );
        } else if (message.body.startsWith("-cnn ")) {
            wait(message, 0);
            cnn(message.body.slice("-cnn ".length), message);
            //berita
            //fitur bot
        } else if (
            message.body === "-bot" ||
            message.body.toLowerCase() === "p"
        ) {
            message.reply(
                "Halo, aku Funday. Ketik *-menu* untuk melihat semua menu. Jika ada kesulitan lihat bantuan di *-help* atau hubungi owner bot ini."
            );
        } else if (message.body === "-help") {
            const mentions = [await client.getContactById(owner)];
            autoBot("help.txt", message, mentions);
        } else if (message.body === "-menu") {
            const mentions = [await client.getContactById(owner)];
            autoBot("menu.txt", message, mentions);
        } else if (message.body === "-groupinfo") {
            if (chat.isGroup) {
                message.reply(
                    `*✱ DETAIL GRUP ✱*\n➮ Nama\t: ${
                        chat.name
                    }\n➮ Deskripsi\t: ${
                        chat.description
                    }\n➮ Dibuat Pada\t: ${chat.createdAt.toString()}\n➮ Dibuat Oleh\t: ${
                        chat.owner ? chat.owner.user : "admin"
                    }\n➮ Jumlah Anggota\t: ${chat.participants.length}`
                );
            } else {
                group(message);
            }
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
            //fitur bot
            //listcommand
        } else if (message.body === "-stickers") {
            let gcs = "*✱ STIKER RANDOM ✱*";
            stickersCmd.forEach((gc) => {
                gcs += `\n★ *-${gc.toLowerCase()}*`;
            });
            if (!stickersCmd.length) gcs += "\n*Tidak Ada!*";
            gcs += "\n\nKetik *-menu* untuk melihat semua menu.";
            message.reply(gcs);
        } else if (message.body === "-emojis") {
            let gcs = "*✱ PLATFORM EMOJI KE STIKER ✱*";
            emojisCmd.forEach((gc) => {
                gcs += `\n★ *-${gc.toLowerCase()}*`;
            });
            if (!emojisCmd.length) gcs += "\n*Tidak Ada!*";
            gcs +=
                "\n\n➮ Perintah :\n    ★ -platform-emoji\n➮ Contoh :\n    ★ -joypixels-🙁\n\nKetik *-help* untuk melihat bantuan.";
            message.reply(gcs);
        } else if (message.body === "-mks") {
            let gcs = "*available matakuliah for task TI-B UR 22*\n";
            mks.forEach((gc) => {
                gcs += `\n-${gc.toLowerCase()}`;
            });
            if (!emojisCmd.length) gcs += "\n*Tidak Ada!*";
            gcs += "\n\nKetik *-menu* untuk melihat semua menu.";
            message.reply(gcs);
        } else if (
            message.body === "-gamecodes" ||
            message.body === "-game" ||
            message.body === "-games"
        ) {
            let gcs = "*✱ DAFTAR GAMECODE ✱*\n";
            gamecodes.forEach((gc) => {
                gcs += `\n★ *-${gc}*`;
            });
            if (!gamecodes.length) gcs += "\n*Tidak Ada!*";
            gcs += "\n\nKetik *-menu* untuk melihat semua menu.";
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
            //listcommand
            //media&stickers
        } else if (message.body === "-img" || message.body == "-toimg") {
            wait(message, 0);
            if (img(message, qtmsg, MessageMedia, 0, 0, 0, 0, user))
                AlphaKey(user);
        } else if (
            message.body.startsWith("-sticker") ||
            message.body == "-s" ||
            message.body.startsWith("-stiker")
        ) {
            // wait(message, 0);
            sticker(message, qtmsg, MessageMedia);
        } else if (message.body.startsWith("-smeme")) {
            const text = message.body.slice("-smeme ".length).split("|");
            if (text.length < 1 || (text[0] == "" && text.length <= 1))
                return message.reply(
                    "Format salah. Kirim atau balas gambar dengan perintah *-smeme* TEKS ATAS|TEKS BAWAH|JARAK TEKS DENGAN ATAS BAWAH GAMBAR|UKURAN FONT untuk membuat stiker dengan teks (meme).\n\nKetik *-help* untuk melihat bantuan."
                );
            // wait(message, 0);
            sticker(
                message,
                qtmsg,
                MessageMedia,
                text[0],
                text[1],
                Number(text[2]),
                Number(text[3])
            );
        } else if (message.body.startsWith("-meme")) {
            const text = message.body.slice("-meme ".length).split("|");
            if (text.length <= 1)
                return message.reply(
                    "Format salah. Kirim atau balas gambar dengan perintah *-meme* TEKS ATAS|TEKS BAWAH|JARAK TEKS DENGAN ATAS BAWAH GAMBAR|UKURAN FONT untuk membuat teks di gambar (meme).\n\nKetik *-help* untuk melihat bantuan."
                );
            // wait(message, 0);
            img(
                message,
                qtmsg,
                MessageMedia,
                text[0],
                text[1],
                Number(text[2]),
                Number(text[3])
            );
        } else if (message.body == "-rmeme") {
            wait(message, 0);
            if (stickers.rmeme(message, MessageMedia, user)) AlphaKey(user);
        } else if (message.body == "-rsmeme") {
            wait(message, 0);
            if (stickers.rsmeme(message, MessageMedia, user)) AlphaKey(user);
        } else if (message.body.startsWith("-pinterest2")) {
            const text = message.body.slice("-pinterest2 ".length);
            if (text.length <= 1)
                return message.reply(
                    "Format salah. Kirim perintah *-pinterest2* KataKunci untuk mendownload gambar dari Pinterest.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 0);
            stickers.pinterest2(text, message, MessageMedia, user);
        } else if (message.body.startsWith("-pinterest")) {
            const text = message.body.slice("-pinterest ".length);
            if (text.length <= 1)
                return message.reply(
                    "Format salah. Kirim perintah *-pinterest* KataKunci untuk mendownload gambar dari Pinterest.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 0);
            stickers.pinterest(text, message, MessageMedia, user);
        } else if (message.body.startsWith("-sttp")) {
            const texts = message.body.split(" ");
            if (texts.length < 2 || (texts[1] == "" && texts.length <= 2))
                return message.reply(
                    "Format salah. Kirim perintah *-sttp* TEKS untuk membuat sticker text-to-picture.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 0);
            const [a, ...text] = texts;
            stickers.ttp(text.join(" "), 1, message, MessageMedia, user);
        } else if (message.body.startsWith("-ttp")) {
            const texts = message.body.split(" ");
            if (texts.length < 2 || (texts[1] == "" && texts.length <= 2))
                return message.reply(
                    "Format salah. Kirim perintah *-ttp* TEKS untuk membuat gambar text-to-picture.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 0);
            const [a, ...text] = texts;
            stickers.ttp(text.join(" "), 0, message, MessageMedia, user);
        } else if (message.body.startsWith("-sattp")) {
            const texts = message.body.split(" ");
            if (texts.length < 2 || (texts[1] == "" && texts.length <= 2))
                return message.reply(
                    "Format salah. Kirim perintah *-attp* TEKS untuk membuat sticker animated-text-to-picture.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 0);
            const [a, ...text] = texts;
            stickers.attp(text.join(" "), 1, message, MessageMedia, user);
        } else if (message.body.startsWith("-attp")) {
            const texts = message.body.split(" ");
            if (texts.length < 2 || (texts[1] == "" && texts.length <= 2))
                return message.reply(
                    "Format salah. Kirim perintah *-attp* TEKS untuk membuat gambar animated-text-to-picture.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 0);
            const [a, ...text] = texts;
            stickers.attp(text.join(" "), 0, message, MessageMedia, user);
            //media&stickers
            //premium&limit
        } else if (message.body === "-limit") {
            // message.reply("Cooming soon..");
            message.reply(AlphaLimit(user).text);
        } else if (
            message.body === "-premiumlist" ||
            message.body === "-listpremium"
        ) {
            let premium = AlphaPremiumList();
            // console.log(premium);
            let prm = "*✱ LIST USER PREMIUM ✱*\n",
                no = 1,
                mentions = [];
            for (const pr of premium) {
                const contact = await client.getContactById(pr.user);
                prm += `\n*${no++}.* @${contact.id.user}`;
                mentions.push(contact);
            }
            if (!premium.length) prm += "\nTidak ada User Premium";
            prm +=
                "\n\n*CATATAN :* Ketik *-addpremium* atau *-premium* untuk daftar jadi User Premium.";
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
                `*✱ DAFTAR PAKET PREMIUM ✱*\n\n*1.* Rp.2.000/bulan -> 100 limit/hari\n\n*2.* Rp.5.0000/bulan -> 500 limit/hari\n\n*3.* Rp.10.000/2 bulan -> 1200 limit/hari\n\n*4.* Rp.10.000/bulan -> 1500 limit/hari\n\n*5.* Rp.15.000/2 bulan -> 2000 limit/hari\n\n*6.* Rp.15.000/bulan -> 3000 limit/hari\n\n*7.* Rp.20.000/3 bulan -> 2500 limit/hari\n\n*8.* Rp.20.000/bulan -> 2000 limit/hari\n\n*9.* Rp.25.000/6 bulan -> 1500 limit/hari\n\n*10.* Rp.25.000/3 bulan -> 3500 limit/hari\n\nTertarik? Hubungi owner bot, @${mentions[0].id.user}.`,
                message.from,
                { mentions }
            );
        } else if (
            message.body.startsWith("-addpr ") &&
            (message.author || message.from) == owner
        ) {
            let texts = message.body.split(" ");
            let user = await message.getMentions();
            user = user[0].id._serialized;
            message.reply(
                newAlphaUser(user, Number(texts[2]), texts[3], texts[4])
            );
        } else if (
            message.body.startsWith("-changepr ") &&
            (message.author || message.from) == owner
        ) {
            let texts = message.body.split(" ");
            let user = await message.getMentions();
            user = user[0].id._serialized;
            message.reply(
                changeAlphaUser(user, Number(texts[2]), texts[3], texts[4])
            );
            //premium&limit
            //downloader
        } else if (message.body.startsWith("-ytaudio")) {
            let url = message.body.split(" ")[1];
            if (!url && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-ytaudio* url untuk download audio dari YouTube.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !url) url = qtmsg.body;
            wait(message, 0);
            ytaudio(url, message, MessageMedia, chat, user);
        } else if (
            message.body.startsWith("-yt") ||
            message.body.startsWith("-ytvid")
        ) {
            let url = message.body.split(" ")[1];
            if (!url && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-ytvid* urlyt untuk download video dari YouTube.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !url) url = qtmsg.body;
            wait(message, 0);
            yt(url, message, MessageMedia, chat, user);
        } else if (
            message.body.startsWith("-tt") ||
            message.body.startsWith("-tiktok")
        ) {
            let url = message.body.split(" ")[1];
            if (!url && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-tt* urltiktok untuk download video dan audio dari TikTok.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !url) url = qtmsg.body;
            wait(message, 0);
            tt(url, message, user);
        } else if (message.body.startsWith("-ig")) {
            let url = message.body.split(" ")[1];
            if (!url && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-ig* urlig untuk download video dari Instagram.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !url) url = qtmsg.body;
            wait(message, 0);
            ig(url, message, MessageMedia, user);
        } else if (message.body.startsWith("-playid")) {
            let query = message.body.split(" ")[1];
            if (!query && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-playid* ID untuk memainkan audio dari YouTube.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !query) query = qtmsg.body;
            wait(message, 0);
            play(
                0,
                Number(query),
                chat.id.user,
                message,
                MessageMedia,
                chat,
                user
            );
        } else if (message.body.startsWith("-play")) {
            let query = message.body.slice("-play ".length);
            if (!query && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-play* KataKunci untuk mencari audio dari YouTube.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !query) query = qtmsg.body;
            wait(message, 2);
            play(query, 0, chat.id.user, message, MessageMedia, chat, user);
        } else if (message.body.startsWith("-autoplay")) {
            let query = message.body.slice("-autoplay ".length);
            if (!query && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-autoplay* KataKunci untuk memainkan audio dari YouTube.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !query) query = qtmsg.body;
            wait(message, 2);
            play(
                query,
                0,
                chat.id.user,
                message,
                MessageMedia,
                chat,
                user,
                true
            );
            //downloader
            //ibadah
        } else if (
            message.body.startsWith("-solat") ||
            message.body.startsWith("-salat") ||
            message.body.startsWith("-shalat")
        ) {
            const kota = message.body.split(" ")[1];
            if (!kota)
                return message.reply(
                    "Format salah. Ketik *-solat* atau *-shalat* kota untuk melihat Jadwal Solat hari ini.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 2);
            salat(kota.toLowerCase(), message);
        } else if (
            message.body.startsWith("-imsyak ") ||
            message.body.startsWith("-imsak ")
        ) {
            const kota = message.body.split(" ")[1];
            if (!kota)
                return message.reply(
                    "Format salah. Ketik *-imsak* atau *-imsyak* kota untuk melihat Jadwal Imsak hari ini.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 2);
            imsak(kota.toLowerCase(), message);
        } else if (message.body === "-spku") {
            wait(message, 2);
            salat("pekanbaru", message);
        } else if (message.body.startsWith("-doa2")) {
            const doaa = message.body.slice("-doa2 ".length);
            if (!doaa)
                return message.reply(
                    "Format salah. Ketik *-doa2* KataKunci untuk mencari Doa.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 2);
            doa2(doaa.toLowerCase(), message);
        } else if (message.body.startsWith("-doaid")) {
            const doaa = message.body.slice("-doaid ".length);
            if (!doaa)
                return message.reply(
                    "Format salah. Ketik *-doa* namaDoa untuk mencari Doa.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 0);
            if (doa(0, Number(doaa), message, chat.id.user, user))
                AlphaKey(user);
        } else if (message.body.startsWith("-doa")) {
            const doaa = message.body.slice("-doa ".length);
            if (!doaa)
                return message.reply(
                    "Format salah. Ketik *-doa* namaDoa untuk mencari Doa.\n\nKetik *-help* untuk melihat bantuan."
                );
            wait(message, 2);
            doa(doaa, 0, message, chat.id.user, user);
        } else if (message.body == "-quran") {
            // wait(message, 2);
            quran(message);
        } else if (message.body.startsWith("-surah")) {
            const query = message.body.slice("-surah ".length);
            if (!query && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-surah* ID_SURAH atau *-surah* ID_SURAH:AYAT1 atau *-surah* ID_SURAH:AYAT1-AYAT2 untuk menampilkan Surah.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !query) query = qtmsg.body;
            wait(message, 2);
            let [id, ayats] = query.split(":");
            if (ayats) {
                ayats = ayats.split("-");
                surah(message, id, ayats);
            } else surah(message, id);
        } else if (message.body.startsWith("-tafsir")) {
            const query = message.body.slice("-tafsir ".length);
            if (!query && !qtmsg)
                return message.reply(
                    "Format salah. Ketik *-tafsir* ID_SURAH atau *-tafsir* ID_SURAH:AYAT1 atau *-tafsir* ID_SURAH:AYAT1-AYAT2 untuk menampilkan Tafsir Surah.\n\nKetik *-help* untuk melihat bantuan."
                );
            if (qtmsg && !query) query = qtmsg.body;
            wait(message, 2);
            let [id, ayats] = query.split(":");
            if (ayats) {
                ayats = ayats.split("-");
                if (tafsir(message, id, user, ayats)) AlphaKey(user);
            } else if (tafsir(message, id, user)) AlphaKey(user);
            //ibadah
            //fakta
        } else if (message.body == "-taugasih") {
            wait(message, 2);
            if ((taugasih(message, MessageMedia), user)) AlphaKey(user);
            //fakta
            //API

            //KULIAH
        } else if (
            message.body.startsWith("-jadwalkuliah") ||
            message.body.startsWith("-jk")
        ) {
            const hari = message.body.split(" ")[1];
            if (!hari)
                return message.reply(
                    "Format salah. Ketik *-jadwalkuliah* 'hari' atau *-jk* 'hari' untuk melihat Jadwal Kuliah TI-B Semester 2."
                );
            jadwalkuliah(hari.toLowerCase(), message);
        } else if (message.body.startsWith("-addtask")) {
            const cmd = message.body.split("+");
            if (cmd.length != 4)
                return message.reply(
                    "Format salah. Ketik *-addtask* 'class' 'mk' 'task1,task2' untuk add task list."
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
                    "Format salah. Ketik *-deltask* 'class' 'mk' 'task1,task2' untuk delete task list."
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
                    "Format salah. Ketik *-viewtask* 'class' 'mk' untuk view task list."
                );
            getTask(cmd[1].toLowerCase(), cmd[2].toLowerCase(), message);
        } else if (message.body.startsWith("-addtb")) {
            const cmd = message.body.split("+");
            if (cmd.length != 3)
                return message.reply(
                    "Format salah. Ketik *-addtb* 'mk' 'task1,task2' untuk add task list for TI-B UR 22."
                );
            addTask("ti-b", cmd[1].toLowerCase(), cmd[2].split(","), message);
        } else if (message.body.startsWith("-deltb")) {
            const cmd = message.body.split("+");
            if (cmd.length != 3)
                return message.reply(
                    "Format salah. Ketik *-deltb* 'mk' 'task1,task2' untuk delete task list for TI-B UR 22."
                );
            delTask("ti-b", cmd[1].toLowerCase(), cmd[2].split(","), message);
        } else if (message.body.startsWith("-vtb")) {
            const cmd = message.body.split("+");
            if (cmd.length != 2)
                return message.reply(
                    "Format salah. Ketik *-vtb* 'mk' untuk view task list for TI-B UR 22."
                );
            getTask("ti-b", cmd[1].toLowerCase(), message);
            //KULIAH

            //KEYWORD&SENSITIVEWORD
        } else if (message.body.startsWith("-addkw ")) {
            const text = message.body.slice("-addkw ".length);
            const [kw, rp] = text.split("|");
            if (!kw || !rp)
                return message.reply(
                    "Format salah. Ketik *-addkw* keyword|balasan untuk menambah keyword baru."
                );
            setKW(kw.toLowerCase(), rp, message);
        } else if (message.body.startsWith("-upkw ")) {
            const text = message.body.slice("-upkw ".length);
            const [kw, rp] = text.split("|");
            if (!kw || !rp)
                return message.reply(
                    "Format salah. Ketik *-upkw* keyword|balasan untuk edit keyword."
                );
            upKW(kw.toLowerCase(), rp, message);
        } else if (message.body.startsWith("-delkw ")) {
            const text = message.body.slice("-delkw ".length);
            if (!text)
                return message.reply(
                    "Format salah. Ketik *-delkw* 'keyword' (tanpa tanda kutip) untuk hapus keyword."
                );
            delKW(text.toLowerCase(), message);
            //KEYWORD&SENSITIVEWORD

            //AI
        } else if (message.body === "-ai" || message.body === "-t") {
            if (!qtmsg) {
                return message.reply(
                    "Halo, aku Funday. Ketik atau balas pesan dengan *-ai* atau *-t* untuk berbicara denganku.\n\nAku bisa semua bahasa loh, jadi tanya sesukamu yaa."
                );
            }
            // wait(message, 1);
            ai(qtmsg.body, qtmsg);
        } else if (
            message.body.startsWith("-ai ") ||
            message.body.startsWith("-t ")
        ) {
            // wait(message, 1);
            const cmd = message.body.startsWith("-ai ") ? "-ai " : "-t ";
            ai(message.body.slice(cmd.length), message);
        } else if (message.body === "-tlid" || message.body == "-tlin") {
            if (!qtmsg) {
                return message.reply(
                    "Halo, aku Funday. Ketik atau balas pesan dengan *-tlid* untuk translate ke bahasa indonesia."
                );
            }
            // wait(message, 1);
            tlid(qtmsg.body, qtmsg);
        } else if (
            message.body.startsWith("-tlid ") ||
            message.body.startsWith("-tlin ")
        ) {
            // wait(message, 1);
            tlid(message.body.slice("-tlid ".length), message);
        } else if (message.body === "-tlen") {
            if (!qtmsg) {
                return message.reply(
                    "Halo, aku Funday. Ketik atau balas pesan dengan *-tlen* untuk translate ke english."
                );
            }
            // wait(message, 1);
            AlphaKey(user);
            tlen(qtmsg.body, qtmsg);
        } else if (message.body.startsWith("-tlen ")) {
            // wait(message, 1);
            tlen(message.body.slice("-tlen ".length), message);
        } else if (message.body === "-stden") {
            if (!qtmsg) {
                return message.reply(
                    "Halo, aku Funday. Ketik atau balas pesan dengan *-stden* untuk membenarkan kalimat ke Grammatical Standard English."
                );
            }
            // wait(message, 1);
            AlphaKey(user);
            stden(qtmsg.body, qtmsg);
        } else if (message.body.startsWith("-stden ")) {
            // wait(message, 1);
            stden(message.body.slice("-stden ".length), message);
            //AI

            //GAME
            //family100
        } else if (message.body === "-fam") {
            if (chat.isGroup) {
                try {
                    // wait(message, 0);
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
                    // wait(message, 0);
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
                    // wait(message, 0);
                    const game = status.setStatus(
                        chat.id.user,
                        1,
                        "caklontong"
                    );
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
                    // wait(message, 0);
                    const game = status.setStatus(chat.id.user, 1, "tebakkata");
                    if (game.status) {
                        const tebakkata = await games.tebakkata(
                            chat.id.user,
                            user
                        );
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
                    // wait(message, 0);
                    const game = status.setStatus(chat.id.user, 1, "tekateki");
                    if (game.status) {
                        const tekateki = await games.tekateki(
                            chat.id.user,
                            user
                        );
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
                    // wait(message, 0);
                    const game = status.setStatus(
                        chat.id.user,
                        1,
                        "tebaklirik"
                    );
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
                    // wait(message, 0);
                    const game = status.setStatus(
                        chat.id.user,
                        1,
                        "tebakkalimat"
                    );
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
            //tebakbendera
        } else if (message.body === "-tebakbendera") {
            if (chat.isGroup) {
                try {
                    // wait(message, 0);
                    const game = status.setStatus(
                        chat.id.user,
                        1,
                        "tebakbendera"
                    );
                    if (game.status) {
                        const tebakbendera = await games.tebakbendera(
                            chat.id.user,
                            user
                        );
                        if (!tebakbendera.play) {
                            message.reply(tebakbendera.text);
                            status.setStatus(chat.id.user, 0, "tebakbendera");
                            return;
                        }
                        await message.reply(
                            await MessageMedia.fromUrl(tebakbendera.img),
                            message.from,
                            { caption: tebakbendera.text }
                        );
                        games.timer(chat.id.user, chat, "tebakbendera");
                    } else {
                        message.reply(game.msg);
                    }
                } catch (err) {
                    error(message, err);
                }
            } else {
                group(message);
            }
            //tebakbendera
            //susunkata
        } else if (message.body === "-susunkata") {
            if (chat.isGroup) {
                try {
                    // wait(message, 0);
                    const game = status.setStatus(chat.id.user, 1, "susunkata");
                    if (game.status) {
                        const susunkata = await games.susunkata(
                            chat.id.user,
                            user
                        );
                        message.reply(susunkata.text);
                        if (!susunkata.play) {
                            status.setStatus(chat.id.user, 0, "susunkata");
                            return;
                        }
                        games.timer(chat.id.user, chat, "susunkata");
                    } else {
                        message.reply(game.msg);
                    }
                } catch (err) {
                    error(message, err);
                }
            } else {
                group(message);
            }
            //susunkata
            //asahotak
        } else if (message.body === "-asahotak") {
            if (chat.isGroup) {
                try {
                    // wait(message, 0);
                    const game = status.setStatus(chat.id.user, 1, "asahotak");
                    if (game.status) {
                        const asahotak = await games.asahotak(
                            chat.id.user,
                            user
                        );
                        message.reply(asahotak.text);
                        if (!asahotak.play) {
                            status.setStatus(chat.id.user, 0, "asahotak");
                            return;
                        }
                        games.timer(chat.id.user, chat, "asahotak");
                    } else {
                        message.reply(game.msg);
                    }
                } catch (err) {
                    error(message, err);
                }
            } else {
                group(message);
            }
            //asahotak
            //tebakkimia
        } else if (message.body === "-tebakkimia") {
            if (chat.isGroup) {
                try {
                    // wait(message, 0);
                    const game = status.setStatus(
                        chat.id.user,
                        1,
                        "tebakkimia"
                    );
                    if (game.status) {
                        const tebakkimia = await games.tebakkimia(
                            chat.id.user,
                            user
                        );
                        message.reply(tebakkimia.text);
                        if (!tebakkimia.play) {
                            status.setStatus(chat.id.user, 0, "tebakkimia");
                            return;
                        }
                        games.timer(chat.id.user, chat, "tebakkimia");
                    } else {
                        message.reply(game.msg);
                    }
                } catch (err) {
                    error(message, err);
                }
            } else {
                group(message);
            }
            //tebakkimia
            //siapakahaku
        } else if (
            message.body === "-siapakahaku" ||
            message.body === "-siapaku" ||
            message.body === "-siapaaku"
        ) {
            if (chat.isGroup) {
                try {
                    // wait(message, 0);
                    const game = status.setStatus(
                        chat.id.user,
                        1,
                        "siapakahaku"
                    );
                    if (game.status) {
                        const siapakahaku = await games.siapakahaku(
                            chat.id.user,
                            user
                        );
                        message.reply(siapakahaku.text);
                        if (!siapakahaku.play) {
                            status.setStatus(chat.id.user, 0, "siapakahaku");
                            return;
                        }
                        games.timer(chat.id.user, chat, "siapakahaku");
                    } else {
                        message.reply(game.msg);
                    }
                } catch (err) {
                    error(message, err);
                }
            } else {
                group(message);
            }
            //siapakahaku
            //tebaktebakan
        } else if (message.body === "-tebaktebakan") {
            if (chat.isGroup) {
                try {
                    // wait(message, 0);
                    const game = status.setStatus(
                        chat.id.user,
                        1,
                        "tebaktebakan"
                    );
                    if (game.status) {
                        const tebaktebakan = await games.tebaktebakan(
                            chat.id.user,
                            user
                        );
                        message.reply(tebaktebakan.text);
                        if (!tebaktebakan.play) {
                            status.setStatus(chat.id.user, 0, "tebaktebakan");
                            return;
                        }
                        games.timer(chat.id.user, chat, "tebaktebakan");
                    } else {
                        message.reply(game.msg);
                    }
                } catch (err) {
                    error(message, err);
                }
            } else {
                group(message);
            }
            //tebaktebakan
        } else if (message.body === "-stop") {
            if (chat.isGroup) {
                message.reply(
                    "Ketik *-stop* gamecode\n\nKetik *-gamecodes* untuk melihat gamecode yang tersedia."
                );
            } else {
                group(message);
            }
        } else if (message.body.startsWith("-stop ")) {
            if (chat.isGroup) {
                try {
                    // wait(message, 0);
                    const game = status.setStatus(
                        chat.id.user,
                        0,
                        message.body.split(" ")[1]
                    );
                    message.reply(game.msg);
                    if (game.status) {
                        AlphaKey(user);
                        if (game.game == "fam") {
                            fam.delSoal(chat.id.user);
                        } else if (game.game == "lontong") {
                            lontong.delSoal(chat.id.user);
                        } else {
                            games.destroy(chat.id.user, game.game);
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
                "Untuk menambah soal, Ketik *-qdd* dengan format berikut.\n\n-qdd\n\n'gamecode' (tanpa tanda kutip)\n\nKetik *-gamecodes* untuk melihat gamecode yang tersedia."
            );
        } else if (message.body.startsWith("-qdd")) {
            let [cmd, game, ...msg] = message.body.split("\n\n");
            if (game == "fam") {
                AlphaKey(user);
                message.reply(fam.writeSoal(msg));
            } else if (game == "lontong") {
                AlphaKey(user);
                message.reply(lontong.writeSoal(msg));
            } else {
                message.reply("Gamecode ini tidak bisa ditambahkan soalnya.");
            }
            //GAME

            //ProbablyCMD
        } else if (message.body.startsWith("-")) {
            const cmd = message.body.split("-")[1].toLowerCase();
            let char = message.body.split("-")[2];
            if (!char && qtmsg) char = qtmsg.body;
            let nocmd = true;
            stickersCmd.forEach((el) => {
                if (el.toLowerCase() == cmd) {
                    nocmd = false;
                    wait(message, 0);
                    return stickers.generate(cmd, message, MessageMedia, user);
                }
            });
            emojisCmd.forEach((el) => {
                if (el.toLowerCase() == cmd) {
                    nocmd = false;
                    if (char) {
                        wait(message, 0);
                        return stickers.emoji(
                            cmd,
                            char,
                            message,
                            MessageMedia,
                            user
                        );
                    }
                    return message.reply(
                        "Format salah. Untuk membuat stiker dari emoji,\n➮ Perintah :\n    ★ -platform-emoji\n➮ Contoh :\n    ★ -joypixels-🙁"
                    );
                }
            });
            if (nocmd)
                message.reply(
                    "Perintah tidak valid. Ketik *-menu* untuk melihat menu. Untuk melihat bantuan, Ketik *-help* atau hubungi owner bot."
                );
            //ProbablyCMD

            //PLAINTEXT
        } else {
            getKW(message.body.toLowerCase(), message);
            if (chat.isGroup) {
                let game;
                try {
                    //gameon
                    game = status.getStatus(chat.id.user);
                    if (game.status) {
                        if (Object.values(game.game).indexOf("fam") > -1) {
                            const soal = fam.getSoal(chat.id.user);
                            if (!soal.play)
                                return fam.setStatus(chat.id.user, 0);

                            for (let i = 0; i < soal.answer.length; i++) {
                                const sim = games.similarity(
                                    soal.answer[i],
                                    message.body
                                );
                                if (sim == 1) {
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
                                        extra = `Hebat! Game telah selesai.\n\nKetik *-lb* untuk melihat leaderboard.`;
                                        fam.setStatus(chat.id.user, 0);
                                        fam.delSoal(chat.id.user);
                                    } else {
                                        soal.answer.splice(i, 1);
                                        extra = `*${soal.answer.length} jawaban tersisa*`;
                                        fam.upSoal(soal);
                                    }
                                    message.reply(
                                        `*✱ FAMILY100 ✱*\n\nJawaban benar. +${soal.reward} point.\n\n${extra}`
                                    );
                                } else if (sim >= 0.7) {
                                    message.reply("Sedikit lagi!!");
                                } else if (sim >= 0.4) {
                                    message.reply("Bisa jadi!!");
                                }
                            }
                        }
                        if (Object.values(game.game).indexOf("lontong") > -1) {
                            const soal = lontong.getSoal(chat.id.user);
                            if (!soal.play)
                                return lontong.setStatus(chat.id.user, 0);
                            const sim = games.similarity(
                                soal.answer,
                                message.body
                            );
                            if (sim == 1) {
                                message.reply(
                                    `*✱ QUIZ LONTONG ✱*\n\nJawaban benar. +${soal.reward} point.\n\nKetik *-lb* untuk melihat leaderboard.`
                                );
                                lontong.setStatus(chat.id.user, 0);
                                lontong.delSoal(chat.id.user);
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
                            } else if (sim >= 0.7) {
                                message.reply("Sedikit lagi!!");
                            } else if (sim >= 0.4) {
                                message.reply("Bisa jadi!!");
                            }
                        }
                        for (let i = 2; i < gamecodes.length; i++) {
                            if (
                                Object.values(game.game).indexOf(gamecodes[i]) >
                                -1
                            ) {
                                games.interact(
                                    chat.id.user,
                                    gamecodes[i],
                                    message,
                                    lb
                                );
                            }
                        }
                    }
                } catch (err) {
                    game = status.getStatus(chat.id.user);
                    if (game.status) {
                        game.game.forEach((d) => {
                            const game = status.setStatus(chat.id.user, 0, d);
                            if (game.status) {
                                if (d == "fam") {
                                    fam.delSoal(chat.id.user);
                                } else if (d == "lontong") {
                                    lontong.delSoal(chat.id.user);
                                } else {
                                    games.destroy(chat.id.user, d);
                                }
                            }
                        });
                    }
                }
            }
        }
        //PLAINTEXT
    } catch (error) {
        console.log(error);
    }
});

client.on("ready", () => {
    status.reset();
    console.log("READY");
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

app.post("/donate", DonationController.handleDonation);

server.listen(port, function () {
    console.log("App running on http://localhost:" + port);
});

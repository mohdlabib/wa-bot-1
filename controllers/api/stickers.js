const { stickers, premiumNotify, image } = require("../utils/autoMsg");
const { AlphaKey, AlphaLimit } = require("../utils/apikey");
const memes = require("random-memes");
const { default: axios } = require("axios");

exports.generate = async (char, message, MessageMedia, user) => {
    try {
        switch (char) {
            case "dinokuning":
                char = "dino-kuning";
                break;
            case "manusialidi":
                char = "manusia-lidi";
                break;
            case "kawansponsbob":
                char = "kawan-sponsbob";
                break;
            case "hopeboy":
                char = "hope-boy";
                break;
            case "krrobot":
                char = "kr-robot";
                break;
            case "kelinci":
                char = "awoawo";
                break;
        }
        const img = await MessageMedia.fromUrl(
            "https://api.zeeoneofc.my.id/api/telegram-sticker/" +
                char +
                "?apikey=" +
                AlphaKey(user),
            { unsafeMime: true }
        );
        if (img.filesize == 133) {
            premiumNotify(message);
            return;
        }
        stickers(message, img);
    } catch (err) {
        message.reply(`*Gagal membuat stiker.*\nCoba lagi!\n\n` + err);
    }
};

exports.emoji = async (platform, char, message, MessageMedia, user) => {
    try {
        const img = await MessageMedia.fromUrl(
            `https://api.zeeoneofc.my.id/api/emoji/${platform}?apikey=${AlphaKey(
                user
            )}&emoji=${char}`,
            { unsafeMime: true }
        );
        if (img.filesize == 133) {
            premiumNotify(message);
            return;
        }
        stickers(message, img);
    } catch (err) {
        message.reply(`*Gagal membuat stiker.*\nCoba lagi!\n\n` + err);
    }
};

exports.ttp = async (text, type, message, MessageMedia, user) => {
    try {
        const img = await MessageMedia.fromUrl(
            `https://api.zeeoneofc.my.id/api/canvas/ttp?apikey=${AlphaKey(
                user
            )}&text=${text}`,
            { unsafeMime: true }
        );
        if (img.filesize == 133) {
            premiumNotify(message);
            return;
        }
        if (type == 1) stickers(message, img);
        else image(message, img);
    } catch (err) {
        message.reply(`*Gagal membuat text-to-picture.*\nCoba lagi!\n\n` + err);
    }
};

exports.attp = async (text, type, message, MessageMedia, user) => {
    try {
        const img = await MessageMedia.fromUrl(
            `https://api.zeeoneofc.my.id/api/canvas/attp?apikey=${AlphaKey(
                user
            )}&text=${text}`,
            { unsafeMime: true }
        );
        if (img.filesize == 133) {
            premiumNotify(message);
            return;
        }
        if (type == 1) stickers(message, img);
        else image(message, img);
    } catch (err) {
        message.reply(
            `*Gagal membuat animated-text-to-picture.*\nCoba lagi!\n\n` + err
        );
    }
};

exports.pinterest = async (text, message, MessageMedia, user) => {
    try {
        let res = await axios.get(
            `https://api.zeeoneofc.my.id/api/downloader/pinterest?apikey=${AlphaKey(
                user
            )}&query=${text}`
        );
        // console.log(res);
        res = res.data.result;
        let i = 1;
        for (const url of res) {
            if (i > 5) break;
            const img = await MessageMedia.fromUrl(url, {
                unsafeMime: true,
                filename: text + i + ".png",
            });
            if (img.filesize == 133) {
                premiumNotify(message);
                return;
            }
            message.reply(img, message.from, {
                sendMediaAsDocument: true,
                caption: `Hasil ke-${i} pencarian "${text}" dari Pinterest.`,
            });
            i++;
        }
    } catch (err) {
        message.reply(
            `*Gagal mencari gambar dari Pinterest.*\nCoba lagi!\n\n` + err
        );
    }
};

exports.pinterest2 = async (text, message, MessageMedia, user) => {
    // https://api.zeeoneofc.my.id/api/downloader/pinterest2?apikey=aESQXF5C&query=loli
    try {
        const img = await MessageMedia.fromUrl(
            `https://api.zeeoneofc.my.id/api/downloader/pinterest2?apikey=${AlphaKey(
                user
            )}&query=${text}`,
            { unsafeMime: true, filename: text + ".png" }
        );
        if (img.filesize == 133) {
            premiumNotify(message);
            return;
        }
        message.reply(img, message.from, {
            sendMediaAsDocument: true,
            caption: `Hasil pencarian "${text}" dari Pinterest.`,
        });
    } catch (err) {
        message.reply(
            `*Gagal mencari gambar dari Pinterest.*\nCoba lagi!\n\n` + err
        );
    }
};

exports.rmeme = (message, MessageMedia, user) => {
    try {
        if (AlphaLimit(user).limit <= 0) {
            premiumNotify(message);
            return;
        }
        memes.random().then(async (meme) => {
            let caption = meme.image;
            const img = await MessageMedia.fromUrl(caption, {
                unsafeMime: true,
            });
            caption = meme.caption;
            message.reply(img, message.from, { caption });
        });
    } catch (err) {
        message.reply(`*Gagal membuat random meme.*\nCoba lagi!\n\n` + err);
        return;
    }
    return true;
};

exports.rsmeme = (message, MessageMedia, user) => {
    try {
        if (AlphaLimit(user).limit <= 0) {
            premiumNotify(message);
            return;
        }
        memes.random().then(async (meme) => {
            let caption = meme.image;
            const img = await MessageMedia.fromUrl(caption, {
                unsafeMime: true,
            });
            stickers(message, img);
        });
    } catch (err) {
        message.reply(`*Gagal membuat random meme.*\nCoba lagi!\n\n` + err);
        return;
    }
    return true;
};

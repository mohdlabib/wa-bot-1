const { stickers, premiumNotify, image } = require("../utils/autoMsg");
const { AlphaKey } = require("../utils/apikey");

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

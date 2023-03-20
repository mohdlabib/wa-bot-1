const { stickers, premiumNotify } = require("../utils/autoMsg");
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
        message.reply(`*gagal membuat stiker.*\ncoba lagi!\n\n` + err);
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
        message.reply(`*gagal membuat stiker.*\ncoba lagi!\n\n` + err);
    }
};

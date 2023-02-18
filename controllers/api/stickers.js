const { stickers } = require("../utils/autoMsg");

exports.generate = async (char, message, MessageMedia) => {
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
            case "dedeu":
                char = "lonte";
                break;
            case "adin":
                char = "lonte";
                break;
        }
        const img = await MessageMedia.fromUrl(
            "https://api.zeeoneofc.xyz/api/telegram-sticker/" +
                char +
                "?apikey=" +
                process.env.Alpha_API_KEY,
            { unsafeMime: true }
        );
        stickers(message, img);
    } catch (error) {
        message.reply(`*failed to create sticker.*\ntry again!\n\n` + error);
    }
};

exports.emoji = async (platform, char, message, MessageMedia) => {
    try {
        let img = await MessageMedia.fromUrl(
            `https://api.zeeoneofc.xyz/api/emoji/${platform}?apikey=${process.env.Alpha_API_KEY}&emoji=${char}`,
            { unsafeMime: true }
        );
        stickers(message, img);
    } catch (err) {
        message.reply(`*failed to create sticker.*\ntry again!\n\n` + err);
    }
};

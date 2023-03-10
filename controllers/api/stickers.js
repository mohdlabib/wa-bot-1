const { stickers } = require("../utils/autoMsg");
const fs = require("fs");

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
        }
        const img = await MessageMedia.fromUrl(
            "https://api.zeeoneofc.my.id/api/telegram-sticker/" +
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
        const img = await MessageMedia.fromUrl(
            `https://api.zeeoneofc.my.id/api/emoji/${platform}?apikey=${process.env.Alpha_API_KEY}&emoji=${char}`,
            { unsafeMime: true }
        );
        stickers(message, img);
        // let media = await MessageMedia.fromUrl(
        //     `https://api.zeeoneofc.my.id/api/emoji/${platform}?apikey=${process.env.Alpha_API_KEY}&emoji=${char}`,
        //     { unsafeMime: true }
        // );
        // if (media) {
        //     const mediaPath = "./downloaded-media/";
        //     if (!fs.existsSync(mediaPath)) {
        //         fs.mkdirSync(mediaPath);
        //     }
        //     const filename = new Date().getTime();
        //     const fullFilename = mediaPath + filename + ".gif";
        //     fs.writeFileSync(fullFilename, media.data, {
        //         encoding: "base64",
        //     });
        //     // console.log("file downloaded!", fullFilename);
        //     stickers(
        //         message,
        //         new MessageMedia(media.mimetype, media.data, fullFilename)
        //     );
        //     fs.unlinkSync(fullFilename);
        //     // console.log(`file deleted!`);
        // }
    } catch (err) {
        // console.log("failed to save:", err);
        // console.log(`file deleted!`, err);
        message.reply(`*failed to create sticker.*\ntry again!\n\n` + err);
    }
};

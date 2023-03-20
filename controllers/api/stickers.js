const { stickers } = require("../utils/autoMsg");
const fs = require("fs");
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
            message.reply(
                "Maaf, limit dari pengguna gratis telah tercapai. Harap menunggu esok hari agar limit refresh kembali. Hubungi owner bot untuk upgrade ke Premium. Terimakasih :)"
            );
            return;
        }
        stickers(message, img);
        // axios
        //     .get(
        //         "https://api.zeeoneofc.my.id/api/telegram-sticker/" +
        //             char +
        //             "?apikey=" +
        //             AlphaKey()
        //     )
        //     .then((response) => {
        //         if (response.data) {
        //             const mediaPath = "./downloaded-media/";
        //             if (!fs.existsSync(mediaPath)) {
        //                 fs.mkdirSync(mediaPath);
        //             }
        //             const filename = new Date().getTime();
        //             const fullFilename =
        //                 mediaPath + filename + Math.random() * 1000;
        //             fs.writeFileSync(fullFilename, response.data, {
        //                 encoding: "base64",
        //             });
        //             // console.log("file downloaded!", fullFilename);
        //             stickers(message, MessageMedia.fromFilePath(fullFilename));
        //             fs.unlinkSync(fullFilename);
        //             // console.log(`file deleted!`);
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err.response.status);
        //     });
    } catch (error) {
        message.reply(`*gagal membuat stiker.*\ncoba lagi!\n\n` + error);
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
            message.reply(
                "Maaf, limit dari pengguna gratis telah tercapai. Harap menunggu esok hari agar limit refresh kembali. Hubungi owner bot untuk upgrade ke Premium. Terimakasih :)"
            );
            return;
        }
        stickers(message, img);
        // let media = await MessageMedia.fromUrl(
        //     `https://api.zeeoneofc.my.id/api/emoji/${platform}?apikey=${AlphaKey()}&emoji=${char}`,
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
        message.reply(`*gagal membuat stiker.*\ncoba lagi!\n\n` + err);
    }
};

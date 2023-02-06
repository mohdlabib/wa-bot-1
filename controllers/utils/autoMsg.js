const fs = require("fs");
const mime = require("mime-types");
const { getStatus } = require("../games/status");
let times = [];

exports.sticker = async (message, image, MessageMedia) => {
    message = message.hasMedia
        ? message
        : image
        ? image.hasMedia
            ? image
            : message
        : message;
    if (message.hasMedia) {
        message.downloadMedia().then(async (media) => {
            if (media) {
                const mediaPath = "./downloaded-media/";
                if (!fs.existsSync(mediaPath)) {
                    fs.mkdirSync(mediaPath);
                }
                const extension = mime.extension(media.mimetype);
                const filename = new Date().getTime();
                const fullFilename = mediaPath + filename + "." + extension;
                try {
                    fs.writeFileSync(fullFilename, media.data, {
                        encoding: "base64",
                    });
                    console.log("file downloaded!", fullFilename);
                    this.stickers(
                        message,
                        MessageMedia.fromFilePath(fullFilename)
                    );
                    // new MessageMedia(
                    //     media.mimetype,
                    //     media.data,
                    //     fullFilename
                    // ),
                    // MessageMedia.fromFilePath(fullFilename);
                    // await client.sendMessage(
                    //     message.from,
                    //     new MessageMedia(
                    //         media.mimetype,
                    //         media.data,
                    //         fullFilename
                    //     ),
                    //     {
                    //         sendMediaAsSticker: true,
                    //         stickerAuthor: "FreackBot",
                    //         stickerName: "FreackStickers",
                    //     }
                    // );
                    fs.unlinkSync(fullFilename);
                    console.log(`file deleted!`);
                } catch (err) {
                    console.log("failed to save:", err);
                    console.log(`file deleted!`, err);
                    message.reply(`*failed to create sticker.*\ntry again!`);
                }
            }
        });
    } else {
        message.reply(`send image with caption *-sticker* to create sticker`);
    }
};

exports.stickers = async (message, MessageMedia) => {
    try {
        await message.reply(MessageMedia, message.from, {
            sendMediaAsSticker: true,
            stickerAuthor: "FreackBot",
            stickerName: "FreackStickers",
        });
    } catch (err) {
        message.reply(`*failed to create sticker.*\ntry again!`);
    }
};

exports.img = async (message, image, MessageMedia, client) => {
    message = message.hasMedia
        ? message
        : image
        ? image.hasMedia
            ? image
            : message
        : message;
    if (message.hasMedia) {
        message.downloadMedia().then(async (media) => {
            if (media) {
                const mediaPath = "./downloaded-media/";
                if (!fs.existsSync(mediaPath)) {
                    fs.mkdirSync(mediaPath);
                }
                const extension = mime.extension(media.mimetype);
                const filename = new Date().getTime();
                const fullFilename = mediaPath + filename + "." + extension;
                try {
                    fs.writeFileSync(fullFilename, media.data, {
                        encoding: "base64",
                    });
                    console.log("file downloaded!", fullFilename);
                    await client.sendMessage(
                        message.from,
                        MessageMedia.fromFilePath(fullFilename)
                    );
                    fs.unlinkSync(fullFilename);
                    console.log(`file deleted!`);
                } catch (err) {
                    console.log("failed to save:", err);
                    console.log(`file deleted!`, err);
                    message.reply(`*failed to send image.*\ntry again!`);
                }
            }
        });
    } else {
        message.reply(
            `send sticker then reply with *-img* or *-toimg* to convert sticker to image`
        );
    }
};

exports.autoBot = (file, msg) => {
    const readStream = fs.createReadStream("./database/" + file, "utf8");

    readStream.on("data", function (chunk) {
        msg.reply(chunk);
    });
};

exports.error = (msg, err) => {
    msg.reply(
        "an error occured. type *-help* to see valid commands.\n\n" + err
    );
};

exports.group = (msg) => {
    msg.reply("This command can only be used in a group!");
};

exports.errai = (msg, err) => {
    msg.reply("sorry, i can't talk right now. something went wrong.\n\n" + err);
};

exports.timer = (grup, chat, gc) => {
    const i = grup + gc.GAME;
    times[i] = 0;
    const val = setInterval(() => {
        times[i]++;
        if (times[i] >= gc.TIME) {
            clearInterval(val);
            times[i] = 0;
            const game = getStatus(grup);
            if (game.status) {
                game.game.forEach((g) => {
                    if (g == gc.GAME) gc.end(grup, chat, -1);
                });
            }
        }
    }, 1000);
};

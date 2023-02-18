const { default: axios } = require("axios");
const { error } = require("../utils/autoMsg");

exports.ytaudio = (url, msg, MessageMedia, chat) => {
    try {
        axios
            .get(
                `https://api.zeeoneofc.xyz/api/downloader/youtube-audio?url=${url}&apikey=${process.env.Alpha_API_KEY}`
            )
            .then(async (response) => {
                let data = response.data;
                if (data.status) {
                    data = data.result;
                    const caption = `Title : ${data.title}\n\nQuality : ${data.quality}\n\nFilesize : ${data.filesize}\n\nDownload : ${data.download}\n`;
                    const media = await MessageMedia.fromUrl(data.download, {
                        unsafeMime: true,
                    });
                    msg.reply(caption);
                    await chat.sendMessage(media);
                }
            })
            .catch((err) => {
                error(msg, err);
            });
    } catch (err) {
        error(msg, err);
    }
};

exports.yt = (url, msg, MessageMedia, chat) => {
    axios
        .get(
            `https://api.zeeoneofc.xyz/api/downloader/youtube-video?url=${url}&apikey=${process.env.Alpha_API_KEY}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `Title : ${data.title}\n\nQuality : ${data.quality}\n\nFilesize : ${data.filesize}\n\nDownload : ${data.download}\n`;
                const media = await MessageMedia.fromUrl(data.download, {
                    unsafeMime: true,
                });
                msg.reply(caption);
                if (data.size <= 32000) chat.sendMessage(media);
            }
        })
        .catch((err) => {
            error(msg, err);
        });
};

exports.tt = (url, msg) => {
    axios
        .get(
            `https://api.zeeoneofc.xyz/api/downloader/tiktok?url=${url}&apikey=${process.env.Alpha_API_KEY}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `\nAudio : ${data.audio}\n\nVideo : ${data.nowm}\n`;
                msg.reply(caption);
                return data;
            }
        })
        .catch((err) => {
            error(msg, err);
        });
};

exports.ttaudio = async (url, msg, MessageMedia, chat) => {
    try {
        let data = this.tt(url, msg);
        if (!data) return error(msg, "can't get the audio.");
        const media = await MessageMedia.fromUrl(data.audio, {
            unsafeMime: true,
        });
        await chat.sendMessage(media);
    } catch (err) {
        error(msg, err);
    }
};

exports.ttvid = async (url, msg, MessageMedia, chat) => {
    try {
        let data = this.tt(url, msg);
        if (!data) return error(msg, "can't get the audio.");
        const media = await MessageMedia.fromUrl(data.nowm, {
            unsafeMime: true,
        });
        await chat.sendMessage(media);
    } catch (err) {
        error(msg, err);
    }
};

const { default: axios } = require("axios");
const { error } = require("../utils/autoMsg");

exports.ytaudio = (url, msg, MessageMedia, chat) => {
    try {
        axios
            .get(
                `https://api.zeeoneofc.my.id/api/downloader/youtube-audio?url=${url}&apikey=${process.env.Alpha_API_KEY}`
            )
            .then(async (response) => {
                let data = response.data;
                if (data.status) {
                    data = data.result;
                    const caption = `*YT Audio Downloader*\n\nTitle : ${data.title}\n\nQuality : ${data.quality}\n\nFilesize : ${data.filesize}\n\nDownload : ${data.download}\n`;
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
            `https://api.zeeoneofc.my.id/api/downloader/youtube-video?url=${url}&apikey=${process.env.Alpha_API_KEY}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `*YT Video Downloader*\n\nTitle : ${data.title}\n\nQuality : ${data.quality}\n\nFilesize : ${data.filesize}\n\nDownload : ${data.download}\n`;
                const media = await MessageMedia.fromUrl(data.download, {
                    unsafeMime: true,
                });
                msg.reply(caption);
                if (data.size <= 54321) chat.sendMessage(media);
            }
        })
        .catch((err) => {
            error(msg, err);
        });
};

exports.tt = (url, msg) => {
    axios
        .get(
            `https://api.zeeoneofc.my.id/api/downloader/tiktok?url=${url}&apikey=${process.env.Alpha_API_KEY}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `*TT Downloader*\n\nAudio : ${data.audio}\n\nVideo : ${data.nowm}\n`;
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
        if (!data) return error(msg, "can't get the video.");
        const media = await MessageMedia.fromUrl(data.nowm, {
            unsafeMime: true,
        });
        await chat.sendMessage(media);
    } catch (err) {
        error(msg, err);
    }
};

exports.ig = (url, msg, MessageMedia) => {
    axios
        .get(
            `https://api.zeeoneofc.my.id/api/downloader/instagram-video?url=${url}&apikey=${process.env.Alpha_API_KEY}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `*IG Video Downloader*\n\nDownload Link : ${data.url}\n\n`;
                msg.reply(caption);
                const media = await MessageMedia.fromUrl(data.url, {
                    unsafeMime: true,
                });
                await msg.reply(media);
            }
        })
        .catch((err) => {
            error(msg, err);
        });
};

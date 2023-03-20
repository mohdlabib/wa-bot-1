const { default: axios } = require("axios");
const { error, premiumNotify } = require("../utils/autoMsg");
const { AlphaKey } = require("../utils/apikey");

exports.ytaudio = (url, msg, MessageMedia, chat, user) => {
    axios
        .get(
            `https://api.zeeoneofc.my.id/api/downloader/youtube-audio?url=${url}&apikey=${AlphaKey(
                user
            )}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `*>> YouTube Audio Downloader <<*\n\nTitle : ${data.title}\n\nQuality : ${data.quality}\n\nFilesize : ${data.filesize}\n\nDownload : ${data.download}\n`;
                const media = await MessageMedia.fromUrl(data.download, {
                    unsafeMime: true,
                });
                msg.reply(caption);
                await chat.sendMessage(media);
            }
        })
        .catch((err) => {
            if (err.response.status == 403) {
                premiumNotify(msg);
                return;
            }
            error(msg, err);
        });
};

exports.yt = (url, msg, MessageMedia, chat, user) => {
    axios
        .get(
            `https://api.zeeoneofc.my.id/api/downloader/youtube-video?url=${url}&apikey=${AlphaKey(
                user
            )}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `*>> YouTube Video Downloader <<*\n\nTitle : ${data.title}\n\nQuality : ${data.quality}\n\nFilesize : ${data.filesize}\n\nDownload : ${data.download}\n`;
                // const media = await MessageMedia.fromUrl(data.download, {
                //     unsafeMime: true,
                // });
                msg.reply(caption);
                // if (data.size <= 54321) chat.sendMessage(media);
            }
        })
        .catch((err) => {
            if (err.response.status == 403) {
                premiumNotify(msg);
                return;
            }
            error(msg, err);
        });
};

exports.tt = (url, msg, user) => {
    axios
        .get(
            `https://api.zeeoneofc.my.id/api/downloader/tiktok?url=${url}&apikey=${AlphaKey(
                user
            )}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `*>> TikTok Downloader <<*\n\nAudio : ${data.audio}\n\nVideo : ${data.nowm}\n`;
                msg.reply(caption);
                return data;
            }
        })
        .catch((err) => {
            if (err.response.status == 403) {
                premiumNotify(msg);
                return;
            }
            error(msg, err);
        });
};

exports.ig = (url, msg, MessageMedia, user) => {
    axios
        .get(
            `https://api.zeeoneofc.my.id/api/downloader/instagram-video?url=${url}&apikey=${AlphaKey(
                user
            )}`
        )
        .then(async (response) => {
            let data = response.data;
            if (data.status) {
                data = data.result;
                const caption = `*>> Instagram Video Downloader <<*\n\nDownload Link : ${data.url}\n\n`;
                msg.reply(caption);
                const media = await MessageMedia.fromUrl(data.url, {
                    unsafeMime: true,
                });
                await msg.reply(media);
            }
        })
        .catch((err) => {
            if (err.response.status == 403) {
                premiumNotify(msg);
                return;
            }
            error(msg, err);
        });
};

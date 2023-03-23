const { default: axios } = require("axios");
const { error, premiumNotify } = require("../utils/autoMsg");
const { AlphaKey } = require("../utils/apikey");
const Scraper = require("@yimura/scraper").default;
const youtube = new Scraper();
const fs = require("fs");

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
                const caption = `*✱ YOUTUBE AUDIO ✱*\n➮ Judul\t: ${data.title}\n➮ Kualitas\t: ${data.quality}\n➮ Filesize\t: ${data.filesize}\n➮ Link : ${data.download}`;
                const media = await MessageMedia.fromUrl(data.download, {
                    unsafeMime: true,
                });
                msg.reply(caption);
                await chat.sendMessage(media);
            }
        })
        .catch((err) => {
            if (err.response) {
                if (err.response.status == 403) {
                    premiumNotify(msg);
                    return;
                }
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
                const caption = `*✱ YOUTUBE VIDEO ✱*\n➮ Judul\t: ${data.title}\n➮ Kualitas\t: ${data.quality}\n➮ Filesize\t: ${data.filesize}\n➮ Download\t: ${data.download}`;
                // const media = await MessageMedia.fromUrl(data.download, {
                //     unsafeMime: true,
                // });
                msg.reply(caption);
                // if (data.size <= 54321) chat.sendMessage(media);
            }
        })
        .catch((err) => {
            if (err.response) {
                if (err.response.status == 403) {
                    premiumNotify(msg);
                    return;
                }
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
                const caption = `*✱ TIKTOK ✱*\n➮ Link 1\t: ${data.audio}\n➮ Link 2\t: ${data.nowm}`;
                msg.reply(caption);
                return data;
            }
        })
        .catch((err) => {
            if (err.response) {
                if (err.response.status == 403) {
                    premiumNotify(msg);
                    return;
                }
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
                const caption = `*✱ INSTAGRAM ✱*\n➮ Download : ${data.url}`;
                msg.reply(caption);
                const media = await MessageMedia.fromUrl(data.url, {
                    unsafeMime: true,
                });
                await msg.reply(media);
            }
        })
        .catch((err) => {
            if (err.response) {
                if (err.response.status == 403) {
                    premiumNotify(msg);
                    return;
                }
            }
            error(msg, err);
        });
};

exports.play = (query, id, grup, msg, MessageMedia, chat, user, autoplay) => {
    try {
        const file = fs.readFileSync("./database/playyt.json");
        let data = JSON.parse(file);
        let text = "*✱ YOUTUBE PLAY AUDIO ✱*\n";
        if (id <= 0) {
            youtube
                .search(query)
                .then((results) => {
                    results = results.videos;
                    text +=
                        "➮ Kata Kunci\t: " +
                        query +
                        "\n➮ Hasil Pencarian\t: " +
                        results.length +
                        "\n\n✲ *HASIL* ✲";
                    if (!results.length) {
                        text +=
                            "\nTidak ditemukan! Coba cari lagi dengan kata kunci yang berbeda.";
                    } else {
                        let no = 1,
                            index = -1,
                            result = [];
                        for (const r of results) {
                            text += `\n*${no++}.* ${r.title} _(${
                                r.duration_raw
                            })_\n`;
                            result.push({
                                duration_raw: r.duration_raw,
                                title: r.title,
                                link: r.link,
                            });
                        }
                        text +=
                            "\n*CATATAN :*\n★ *-playid* ID_AUDIO ➔\n    ➮ Memainkan audio dari daftar hasil pencarian.\n    ➮ ID_AUDIO = Nomor";
                        data.filter((d, i) => {
                            if (d.grup == grup) index = i;
                        });
                        if (index == -1) data.push({ grup, result });
                        else data[index].result = result;
                        fs.writeFileSync(
                            "./database/playyt.json",
                            JSON.stringify(data)
                        );
                        if (autoplay)
                            return this.play(
                                0,
                                1,
                                grup,
                                msg,
                                MessageMedia,
                                chat,
                                user
                            );
                    }
                    msg.reply(text);
                })
                .catch((err) => {
                    error(msg, err);
                });
        } else {
            let index = -1;
            data.filter((d, i) => {
                if (d.grup == grup) index = i;
            });
            if (index == -1) {
                text +=
                    "\nData pencarian tidak ditemukan! Silahkan mencari audio yang ingin diputar dengan perintah *-play* KataKunci.";
                return msg.reply(text);
            } else {
                data = data[index].result[id - 1].link;
                this.ytaudio(data, msg, MessageMedia, chat, user);
            }
        }
    } catch (err) {
        error(msg, err);
    }
};

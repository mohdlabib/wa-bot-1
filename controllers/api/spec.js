const axios = require("axios");

exports.spec = (hp, message, MessageMedia, chat) => {
    axios
        .get("http://phone-specs-api.azharimm.dev/search?query=" + hp)
        .then((query) => {
            if (!query.data.status) {
                return message.reply(query.data.message);
            }
            if (!query.data.data.phones.length) {
                return message.reply(
                    "maaf, gagal mencari ponsel yang kamu maksud. ada error."
                );
            }
            this.spek(
                query.data.data.phones[0].slug,
                message,
                MessageMedia,
                chat
            );
        })
        .catch((err) => {
            message.reply(
                "maaf, gagal mencari ponsel yang kamu maksud.\n\n" + err
            );
        });
};

exports.speq = (hp, message) => {
    axios
        .get("http://phone-specs-api.azharimm.dev/search?query=" + hp)
        .then((query) => {
            if (!query.data.status) {
                return message.reply(query.data.message);
            }
            let data = query.data.data;
            let text = `*${data.title}*\n`;
            let i = 1;
            data.phones.forEach((phone) => {
                text += `\n${i++}.\n- Nama: ${phone.phone_name}\n- Brand: ${
                    phone.brand
                }\n- Keyword: ${phone.slug}\n`;
            });
            message.reply(text);
        })
        .catch((err) => {
            message.reply(
                "maaf, gagal mencari ponsel yang kamu maksud.\n\n" + err
            );
        });
};

exports.spek = async (hp, message, MessageMedia, chat) => {
    axios
        .get("http://phone-specs-api.azharimm.dev/" + hp)
        .then((res) => {
            if (!res.data.status) {
                return message.reply(res.data.message);
            }
            const data = res.data.data;
            let text = `*${data.phone_name}*\n\n- Nama: ${data.phone_name}\n- Brand: ${data.brand}\n- Tanggal Rilis: ${data.release_date}\n- Dimensi: ${data.dimension}\n- OS: ${data.os}\n- Storage: ${data.storage}\n- Spesifikasi:`;
            data.specifications.forEach((spec) => {
                text += `\n\t+ ${spec.title} :\n`;
                spec.specs.forEach((s) => {
                    text += `\t\t- ${s.key}: ${s.val}\n`;
                });
            });
            message.reply(text);
            if (data.phone_images.length > 0) {
                data.phone_images.forEach(async (img) => {
                    const media = await MessageMedia.fromUrl(img);
                    await chat.sendMessage(media);
                });
            }
        })
        .catch((err) => {
            message.reply(
                "maaf, gagal mencari ponsel yang kamu maksud.\n\n" + err
            );
        });
};

exports.speb = (cmd, msg) => {
    const search = cmd != "-speq" ? "phone specifications" : "phones name";
    const query = cmd != "-spec" ? "keyword" : "phone name";
    return msg.reply(
        "to search " +
            search +
            " based on a " +
            query +
            ", type *" +
            cmd +
            "* '" +
            query +
            "'."
    );
};

exports.specs = (cmd, hp, msg, MessageMedia, chat) => {
    if (cmd == "-spek") {
        this.spek(hp, msg, MessageMedia, chat);
    } else if (cmd == "-spec") {
        this.spec(hp, msg, MessageMedia, chat);
    } else {
        this.speq(hp, msg);
    }
};

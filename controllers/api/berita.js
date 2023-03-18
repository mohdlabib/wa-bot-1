const { default: axios } = require("axios");

exports.cnn = async (kategori, msg) => {
    try {
        const response = await axios.get(
            "https://api-berita-indonesia.vercel.app/cnn/" + kategori
        );
        const data = response.data.data;
        let text = `*${data.title}*\n`;
        let i = 1;
        data.posts.forEach((post) => {
            text += `\n${i++}.\n- Judul: ${post.title}\n- Tanggal: ${
                post.pubDate
            }\n- Link: ${post.link}\n`;
        });
        msg.reply(text);
    } catch (err) {
        this.base("", "", msg);
    }
};

exports.base = (portal, kategori, msg) => {
    const c = "type *-category* 'newsportal' to view valid categories.";
    const p = "type *-newsportal* to view valid newsportals.";
    if (!portal) {
        return msg.reply("sorry, category not valid. " + c);
    }
    if (!kategori) {
        return msg.reply(
            "to search for the latest news through " +
                portal +
                ", type -" +
                portal +
                " 'category'.\n\n" +
                c
        );
    }
    if (portal && kategori) {
        return msg.reply(p);
    }
    return msg.reply(c);
};

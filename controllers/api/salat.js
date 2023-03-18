const { default: axios } = require("axios");
const { error } = require("../utils/autoMsg");

exports.salat = async (kota, msg) => {
    try {
        const date = new Date();
        const time = date.toISOString().slice(0, 10);
        const [year, month, day] = time.split("-");
        const response = await axios.get(
            `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${kota}/${year}/${month}.json`
        );
        let data = response.data;
        let text = `*JADWAL SHALAT ${kota.toUpperCase()}*\n\n-${date
            .toString()
            .slice(0, 15)}-\n\n`;
        data = data.filter((d) => d.tanggal == time);
        if (!data.length)
            return msg.reply(
                "maaf, data tidak ditemukan. periksa lagi kota yang kamu masukkan."
            );
        data = data[0];
        text += `> Imsak\t: ${data.imsyak}\n> Subuh\t: ${data.shubuh}\n> Terbit\t: ${data.terbit}\n> Dhuha\t: ${data.dhuha}\n> Dzuhur\t: ${data.dzuhur}\n> Ashar\t: ${data.ashr}\n> Magrib\t: ${data.magrib}\n> Isya\t\t: ${data.isya}\n\n_jangan lupa solat, yaa?_`;
        msg.reply(text);
    } catch (err) {
        error(msg, err);
    }
};

exports.doa = (doa, msg) => {
    let link = "https://doa-doa-api-ahmadramadhan.fly.dev/api/doa/";
    let text = ``;
    if (doa == "all") {
        link = "https://doa-doa-api-ahmadramadhan.fly.dev/api/";
        doa = "";
    }
    axios
        .get(link + doa)
        .then((response) => {
            let data = response.data;
            if (data.length) {
                data.forEach((d) => {
                    text += `\n*> ${d.doa.toUpperCase()} <*\n\n${d.ayat}\n\n_${
                        d.latin
                    }_\n\nArtinya : ${d.artinya}\n\n`;
                });
            } else {
                text += `\n*> ${data.doa.toUpperCase()} <*\n\n${
                    data.ayat
                }\n\n_${data.latin}_\n\nArtinya : ${data.artinya}\n`;
            }
            msg.reply(text);
        })
        .catch((err) => {
            text +=
                "mohon maaf doa yang anda cari gak ketemu, silahkan cari dengan kata kunci lain : )\n\n" +
                err;
            msg.reply(text);
        });
};

const { default: axios } = require("axios");
const { similarity } = require("../games/games");
const { AlphaLimit } = require("../utils/apikey");
const { error, premiumNotify } = require("../utils/autoMsg");
const fs = require("fs");

exports.salat = async (kota, msg) => {
    try {
        const date = new Date();
        const time = date.toISOString().slice(0, 10);
        const [year, month, day] = time.split("-");
        const response = await axios.get(
            `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${kota}/${year}/${month}.json`
        );
        let data = response.data;
        let text = `*✱ JADWAL SHALAT ${kota.toUpperCase()} ✱*\n\n-${date
            .toString()
            .slice(0, 15)}-\n\n`;
        data = data.filter((d) => d.tanggal == time);
        if (!data.length)
            return msg.reply(
                "Maaf, data tidak ditemukan. Periksa lagi kota yang kamu masukkan."
            );
        data = data[0];
        text += `➮ Imsak\t: ${data.imsyak}\n➮ Subuh\t: ${data.shubuh}\n➮ Terbit\t: ${data.terbit}\n➮ Dhuha\t: ${data.dhuha}\n➮ Dzuhur : ${data.dzuhur}\n➮ Ashar\t: ${data.ashr}\n➮ Magrib : ${data.magrib}\n➮ Isya\t: ${data.isya}\n\n_Jangan lupa solat, yaa?_`;
        msg.reply(text);
    } catch (err) {
        error(msg, err);
    }
};

exports.imsak = async (kota, msg) => {
    try {
        const date = new Date();
        const time = date.toISOString().slice(0, 10);
        const [year, month, day] = time.split("-");
        const response = await axios.get(
            `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${kota}/${year}/${month}.json`
        );
        let data = response.data;
        let text = `*✱ JADWAL IMSAK ${kota.toUpperCase()} ✱*\n\n-${date
            .toString()
            .slice(0, 15)}-\n\n`;
        data = data.filter((d) => d.tanggal == time);
        if (!data.length)
            return msg.reply(
                "Maaf, data tidak ditemukan. Periksa lagi kota yang kamu masukkan."
            );
        data = data[0];
        text += `➮ Imsak\t: ${data.imsyak}\n\n_Semoga kuat puasanyaa :)_`;
        msg.reply(text);
    } catch (err) {
        error(msg, err);
    }
};

exports.doa2 = (doa, msg) => {
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
                    text += `\n*✱ ${d.doa.toUpperCase()} ✱*\n\n${d.ayat}\n\n_${
                        d.latin
                    }_\n\nArtinya : ${d.artinya}\n\n`;
                });
            } else {
                text += `\n*✱ ${data.doa.toUpperCase()} ✱*\n\n${
                    data.ayat
                }\n\n_${data.latin}_\n\nArtinya : ${data.artinya}\n`;
            }
            msg.reply(text);
        })
        .catch((err) => {
            text +=
                "Mohon maaf doa yang anda cari gak ketemu, silahkan cari dengan kata kunci lain : )\n\n" +
                err;
            msg.reply(text);
        });
};

exports.doa = (doa, id, msg, grup, user) => {
    try {
        if (AlphaLimit(user).limit <= 0) {
            premiumNotify(msg);
            return;
        }
        const file = fs.readFileSync("./database/doa.json");
        let data = JSON.parse(file);
        let text = ``;
        if (id <= 0) {
            axios
                .get("https://equran.id/api/doa")
                .then((res) => {
                    res = res.data;
                    let index = [],
                        result = [];
                    res.filter((d, i) => {
                        if (similarity(d.nama, doa) >= 0.4) index.push(i);
                    });
                    if (!index.length) {
                        text +=
                            "Mohon maaf doa yang anda cari gak ketemu, silahkan cari dengan kata kunci lain : )";
                        return msg.reply(text);
                    }
                    text += `*✱ HASIL PENCARIAN DOA ✱*\n➮ Kata Kunci\t: ${doa}\n➮ Hasil Pencarian\t: ${index.length}`;
                    text += `\n\n*✲ HASIL ✲*`;
                    index.forEach((d, i) => {
                        text += `\n*${i + 1}.* ${res[d].nama}`;
                        result.push(res[d].id);
                    });
                    index = -1;
                    data.filter((d, i) => {
                        if (d.grup == grup) index = i;
                    });
                    if (index == -1) data.push({ grup, result });
                    else data[index].result = result;
                    text +=
                        "\n\n*CATATAN :*\n★ *-doaid* ID_DOA ➔\n    ➮ Menampilkan doa dari daftar hasil pencarian.\n    ➮ ID_DOA = Nomor";
                    data.filter((d, i) => {
                        if (d.grup == grup) index = i;
                    });
                    if (index == -1) data.push({ grup, result });
                    else data[index].result = result;
                    fs.writeFileSync(
                        "./database/doa.json",
                        JSON.stringify(data)
                    );
                    msg.reply(text);
                })
                .catch((err) => {
                    text +=
                        "Mohon maaf doa yang anda cari gak ketemu, silahkan cari dengan kata kunci lain : )\n\n" +
                        err;
                    msg.reply(text);
                });
        } else {
            let index = -1;
            data.filter((d, i) => {
                if (d.grup == grup) index = i;
            });
            if (index == -1) {
                text +=
                    "\nData pencarian tidak ditemukan! Silahkan mencari doa yang ingin ditampilkan dengan perintah *-doa* namaDoa.";
                return msg.reply(text);
            } else {
                axios
                    .get(
                        `https://equran.id/api/doa/${
                            data[index].result[id - 1]
                        }`
                    )
                    .then((res) => {
                        // console.log(res);
                        res = res.data;
                        text += `*✱ ${res.nama.toUpperCase()} ✱*\n\n${
                            res.ar
                        }\n\n_${res.tr}_\n\n"${res.idn}"\n\n➮ Tentang Doa :\n${
                            res.tentang
                        }`;
                        msg.reply(text);
                    })
                    .catch((err) => {
                        text +=
                            "Mohon maaf doa yang anda cari gak bisa ditampilkan. Silahkan coba lagi : )\n\n" +
                            err;
                        msg.reply(text);
                        return;
                    });
            }
        }
    } catch (err) {
        error(msg, err);
        return;
    }
    return true;
};

exports.quran = (msg) => {
    msg.reply(
        `*✱ DAFTAR SURAH QURAN ✱*\n\n*1.* Al Fatihah (Pembuka)\n*2.* Al Baqarah (Sapi Betina)\n*3.* Ali Imran (Keluarga Imran)\n*4.* An Nisa (Wanita)\n*5.* Al Ma'idah (Jamuan)\n*6.* Al An'am (Hewan Ternak)\n*7.* Al-A'raf (Tempat yang Tertinggi)\n*8.* Al-Anfal (Harta Rampasan Perang)\n*9.* At-Taubah(Pengampunan)\n*10.* Yunus (Nabi Yunus)\n*11.* Hud (Nabi Hud)\n*12.* Yusuf (Nabi Yusu)\n*13.* Ar-Ra'd (Guruh)\n*14.* Ibrahim (Nabi Ibrahim)\n*15.* Al-Hijr (Gunung Al Hijr)\n*16.* An-Nahl (Lebah)\n*17.* Al-Isra' (Perjalanan Malam)\n*18.* Al-Kahf (Penghuni-penghuni Gua)\n*19.* Maryam (Maryam)\n*20.* Ta Ha (Ta Ha)\n*21.* Al-Anbiya (Nabi-Nabi)\n*22.* Al-Hajj (Haji)\n*23.* Al-Mu'minun (Orang-orang mukmin)\n*24.* An-Nur (Cahaya)\n*25.* Al-Furqan (Pembeda)\n*26.* Asy-Syu'ara' (Penyair)\n*27.* An-Naml (Semut)\n*28.* Al-Qasas (Kisah-kisah)\n*29.* Al-'Ankabut (Laba-laba)\n*30.* Ar-Rum (Bangsa Romawi)\n*31.* Luqman (Keluarga Luqman)\n*32.* As-Sajdah (Sajdah)\n*33.* Al-Ahzab (Golongan-golongan yang Bersekutu)\n*34.* Saba' (Kaum Saba')\n*35.* Fatir (Pencipta)\n*36.* Ya Sin (Yaasiin)\n*37.* As-Saffat (Barisan-barisan)\n*38.* Sad (Shaad)\n*39.* Az-Zumar (Rombongan-rombongan)\n*40.* Ghafir (Yang Mengampuni)\n*41.* Fussilat (Yang Dijelaskan)\n*42.* Asy-Syura (Musyawarah)\n*43.* Az-Zukhruf (Perhiasan)\n*44.* Ad-Dukhan (Kabut)\n*45.* Al-Jasiyah (Yang Bertekuk Lutut)\n*46.* Al-Ahqaf (Bukit-bukit Pasir)\n*47.* Muhammad (Nabi Muhammad)\n*48.* Al-Fath (Kemenangan)\n*49.* Al-Hujurat (Kamar-kamar)\n*50.* Qaf (Qaaf)\n*51.* Az-Zariyat (Angin yang Menerbangkan)\n*52.* At-Tur (Bukit)\n*53.* An-Najm (Bintang)\n*54.* Al-Qamar (Bulan)\n*55.* Ar-Rahman (Yang Maha Pemurah)\n*56.* Al-Waqi'ah (Hari Kiamat)\n*57.* Al-Hadid (Besi)\n*58.* Al-Mujadilah (Wanita yang Mengajukan Gugatan)\n*59.* Al-Hasyr (Pengusiran)\n*60.* Al-Mumtahanah (Wanita yang Diuji)\n*61.* As-Saff (Satu Barisan)\n*62.* Al-Jumu'ah (Hari Jum'at)\n*63.* Al-Munafiqun (Orang-orang yang Munafik)\n*64.* At-Tagabun (Hari Dinampakkan Kesalahan-kesalahan)\n*65.* At-Talaq (Talak)\n*67.* Al-Mulk (Kerajaan)\n*68.* Al-Qalam (Pena)\n*69.* Al-Haqqah (Hari Kiamat)\n*70.* Al-Ma'arij (Tempat Naik)\n*71.* Nuh (Nabi Nuh)\n*72.* Al-Jinn (Jin)\n*73.* Al-Muzzammil (Orang yang Berselimut)\n*74.* Al-Muddassir (Orang yang Berkemul)\n*75.* Al-Qiyamah (Kiamat)\n*76.* Al-Insan (Manusia)\n*77.* Al-Mursalat (Malaikat-Malaikat Yang Diutus)\n*78.* An-Naba' (Berita Besar)\n*79.* An-Nazi'at (Malaikat-Malaikat Yang Mencabut)\n*80.* 'Abasa (Ia Bermuka Masam)\n*81.* At-Takwir (Menggulung)\n*82.Al-Infitar (Terbelah)\n*83.* Al-Tatfif (Orang-orang yang Curang)\n*84.* Al-Insyiqaq (Terbelah)\n*85.* Al-Buruj (Gugusan Bintang)\n*86.* At-Tariq (Yang Datang di Malam Hari)\n*87.* Al-A'la (Yang Paling Tinggi)\n*88.* Al-Gasyiyah (Hari Pembalasan)\n*89.* Al-Fajr (Fajar)\n*90.* Al-Balad (Negeri)\n*91.* Asy-Syams (Matahari)\n*92.* Al-Lail (Malam)\n*93.* Ad-Duha (Waktu Matahari Sepenggalahan Naik (Dhuha))\n*94.* Al-Insyirah (Melapangkan)\n*95.* At-Tin (Buah Tin)\n*96.* Al-'Alaq (Segumpal Darah)\n*97.* Al-Qadr (Kemuliaan)\n*98.* Al-Bayyinah (Pembuktian)\n*99.* Az-Zalzalah (Kegoncangan)\n*100.* Al-'Adiyat (Berlari Kencang)\n*101.* Al-Qari'ah (Hari Kiamat)\n*102.* At-Takasur (Bermegah-megahan)\n*103.* Al-'Asr (Masa)\n*104.* Al-Humazah (Pengumpat)\n*105.* Al-Fil (Gajah)\n*106.* Quraisy (Suku Quraisy)\n*107.* Al-Ma'un (Barang-barang yang Berguna)\n*108.* Al-Kausar (Nikmat yang Berlimpah)\n*109.* Al-Kafirun (Orang-orang Kafir)\n*110.* An-Nasr (Pertolongan)\n*111.* Al-Lahab (Gejolak Api)\n*112.* Al-Ikhlas (Ikhlas)\n*113.* Al-Falaq (Waktu Subuh)\n*114.* An-Nas (Umat Manusia)\n\n*CATATAN :*\n➮ ID_SURAH = Nomor Surah`
    );
};

exports.surah = async (msg, id) => {
    try {
        const response = await axios.get(
            `https://raw.githubusercontent.com/penggguna/QuranJSON/master/surah/${id}.json`
        );
        let index = response.data;
        let text = `*✱ Q.S ${index.name} ✱*\n➮ Arti Nama :\n    ➮ ${index.name_translations.en}\n    ➮ ${index.name_translations.id}\n➮ Jumlah Ayat : ${index.number_of_ayah}\n➮ Surah ke : ${index.number_of_surah}\n➮ Turun di : ${index.place} (${index.type})\n➮ Download Audio :`;
        index.recitations.forEach((d) => {
            text += `\n    ➮ ${d.name} : ${d.audio_url}`;
        });
        text += `\n\n*✲ AYAT ✲*`;
        index.verses.forEach((d) => {
            text += `\n*${d.number}.*\n${d.text}\n"${d.translation_id}"\n_"${d.translation_en}"_\n`;
        });
        text +=
            "\n*CATATAN :*\n★ *-tafsir* ID_SURAH\n    ➮ ID_SURAH = Nomor Surah\n    ➮ Untuk melihat tafsir Surah.";
        msg.reply(text);
    } catch (err) {
        error(msg, err);
    }
};

exports.tafsir = async (msg, id, user) => {
    try {
        if (AlphaLimit(user).limit <= 0) {
            premiumNotify(msg);
            return;
        }
        const response = await axios.get(
            `https://raw.githubusercontent.com/penggguna/QuranJSON/master/surah/${id}.json`
        );
        let index = response.data;
        let text = `*✱ Q.S ${index.name} ✱*\n➮ Arti Nama :\n    ➮ ${index.name_translations.en}\n    ➮ ${index.name_translations.id}\n➮ Jumlah Ayat : ${index.number_of_ayah}\n➮ Surah ke : ${index.number_of_surah}\n➮ Turun di : ${index.place} (${index.type})\n➮ Download Audio :`;
        index.recitations.forEach((d) => {
            text += `\n    ➮ ${d.name} : ${d.audio_url}`;
        });
        const ayah = index.number_of_ayah;
        index = index.tafsir.id.kemenag;
        text += `\n\n*✲ TAFSIR ✲*\n➮ Dari\t: ${index.name}\n➮ Sumber\t: ${index.source}`;
        for (let i = 1; i <= ayah; i++) {
            const d = index.text[`${i}`];
            text += `\n\n*${i}*. ${d}`;
        }
        msg.reply(text);
    } catch (err) {
        error(msg, err);
        return;
    }
    return true;
};

exports.taugasih = async (msg, MessageMedia, user) => {
    try {
        if (AlphaLimit(user).limit <= 0) {
            premiumNotify(msg);
            return;
        }
        const response = await axios.get(
            `https://cinnabar.icaksh.my.id/public/daily/tawiki`
        );
        let index = response.data.data;
        let caption = `*✱ TAHUKAH KAMU ✱*`;
        index.info.forEach((d) => {
            caption += `\n\n*Tau ga sih?*\n${d.tahukah_anda}`;
        });
        const img = await MessageMedia.fromUrl(index.image_link, {
            unsafeMime: true,
        });
        msg.reply(img, msg.from, { caption });
    } catch (err) {
        error(msg, err);
        return;
    }
    return true;
};

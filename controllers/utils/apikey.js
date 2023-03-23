const fs = require("fs");

exports.AlphaPremiumList = () => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    return data.filter((d) => d.role == "premium");
};

exports.AIKey = () => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    let aikey = data[0].keyAI;
    return aikey;
};

exports.AlphaKey = (user) => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    let index = 0;
    data.filter((d, i) => {
        if (d.user == user) index = i;
    });
    if (index != 0) {
        if (data[index].count > data[index].limit) return;
        data[index].count++;
        fs.writeFileSync("./database/api.json", JSON.stringify(data));
        return data[index].key;
    }
};

exports.newAlphaUser = (user, limit, name, key) => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    let ndata = data.filter((d) => d.user == user);
    if (ndata.length)
        return "User sudah ada di database. Tidak perlu mendaftar lagi.";
    let last = new Date();
    last =
        last.getDate().toString() +
        (last.getMonth() + 1).toString() +
        last.getFullYear().toString();
    if (name) {
        ndata = data.filter((d) => d.name == "alpha|" + name);
        if (ndata.length)
            return "Username sudah ada. Cari username yang lain yaa.";
        data.push({
            user,
            name,
            count: 0,
            key: key ? key : data[0].keyAlpha0,
            limit,
            role: "premium",
            last,
        });
        return (
            "Berhasil menambahkan " +
            name +
            " ke User Premium. Terimakasih atas dukungan dan kepercayaan kamu terhadap bot Funday yaa :)"
        );
    }
    data.push({
        user,
        name: "alpha|free",
        count: 0,
        key: data[0].keyAlpha0,
        limit,
        role: "free",
        last,
    });
    fs.writeFileSync("./database/api.json", JSON.stringify(data));
    return "Berhasil menambahkan Nomor ke Database. Cek limit dengan perintah *-limit*, upgrade ke Premium dengan perintah *-premium*.";
};

exports.refreshAlphaUser = (user) => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    let index = 0;
    data.filter((d, i) => {
        if (d.user == user) index = i;
    });
    if (index == 0) return;
    let last = new Date();
    last =
        last.getDate().toString() +
        (last.getMonth() + 1).toString() +
        last.getFullYear().toString();
    if (data[index].last != last) {
        data[index].last = last;
        data[index].count = 0;
    }
    fs.writeFileSync("./database/api.json", JSON.stringify(data));
};

exports.changeAlphaUser = (user, limit, name, key) => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    let index = 0;
    data.filter((d, i) => {
        if (d.user == user) index = i;
    });
    if (index == 0)
        return "User belum ada di database. Silahkan mendaftar terlebih dahulu.\n\nUpgrade ke Premium dengan perintah *-premium*.";
    data[index].limit = limit;
    if (name) {
        data[index].name = "alpha|" + name;
        data[index].role = "premium";
    }
    if (key) data[index].key = key;
    fs.writeFileSync("./database/api.json", JSON.stringify(data));
    return "Berhasil mengubah Nomor/Username/Limit/Key dari Database.";
};

exports.AlphaLimit = (user) => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    index = 0;
    data.filter((d, i) => {
        if (d.user == user) index = i;
    });
    if (index == 0)
        return "User belum ada di database. Silahkan mendaftar terlebih dahulu.\n\nUpgrade ke Premium dengan perintah *-premium*.";
    const limit = data[index].limit - data[index].count;
    return {
        text: `*✱ LIMIT ✱*\n➮ Username : ${
            data[index].name.split("|")[1]
        }\n➮ Request Hari Ini : ${data[index].count}\n➮ Maksimal Request : ${
            data[index].limit
        }\n➮ Limit Tersisa : ${limit}`,
        limit,
    };
};

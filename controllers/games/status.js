const fs = require("fs");

exports.getStatus = (grup) => {
    const file = fs.readFileSync("./database/status.json");
    const data = JSON.parse(file);
    const status = data.filter((d) => d.grup === grup);
    if (status.length) {
        let game = [];
        status.forEach((element) => {
            game.push(element.game);
        });
        return { status: true, game };
    } else {
        return {
            status: false,
            msg: "Game belum dimulai. Ketik *-menu* untuk melihat menu.",
        };
    }
};

exports.gameTitle = (game) => {
    switch (game) {
        case "fam":
            return "*✱ FAMILY100 ✱*\n\n";
        case "lontong":
            return "*✱ QUIZ LONTONG ✱*\n\n";
        case "caklontong":
            return "*✱ CAK LONTONG ✱*\n\n";
        case "tebakkata":
            return "*✱ TEBAK KATA ✱*\n\n";
        case "tebaklirik":
            return "*✱ TEBAK LIRIK ✱*\n\n";
        case "tebakkalimat":
            return "*✱ TEBAK KALIMAT ✱*\n\n";
        case "tekateki":
            return "*✱ TEKATEKI ✱*\n\n";
        case "tebakbendera":
            return "*✱ TEBAK BENDERA ✱*\n\n";
        case "susunkata":
            return "*✱ SUSUN KATA ✱*\n\n";
        case "asahotak":
            return "*✱ ASAH OTAK ✱*\n\n";
        case "tebakkimia":
            return "*✱ TEBAK KIMIA ✱*\n\n";
        case "siapakahaku":
            return "*✱ SIAPAKAH AKU ✱*\n\n";
        case "tebaktebakan":
            return "*✱ TEBAK-TEBAKAN ✱*\n\n";
    }
};

exports.setStatus = (grup, act, game) => {
    const file = fs.readFileSync("./database/status.json");
    let data = JSON.parse(file);
    let id = data[0].ids;
    const temp = data.filter((obj) => obj.grup == grup && obj.game == game);
    let status = { status: true, msg: "", game };
    status.msg = this.gameTitle(game);
    if (act == 1) {
        if (temp.length) {
            status.status = false;
            status.msg += `Game masih berjalan..\nKetik *-stop* gamecode untuk menghentikan game.`;
            return status;
        }
        data.push({ id, grup, game });
        id++;
        data.splice(0, 1, { ids: id });
    } else {
        if (!temp.length) {
            status.status = false;
            status.msg += `Game belum dimulai. Ketik *-menu* untuk melihat menu.`;
            return status;
        }
        data = data.filter((obj) => temp[0].id != obj.id);
        status.msg += `Game dihentikan.`;
    }
    fs.writeFileSync("./database/status.json", JSON.stringify(data));
    return status;
};

exports.rand = (min, max) => {
    let offset = min;
    let range = max - min + 1;

    let randomNumber = Math.floor(Math.random() * range) + offset;
    return randomNumber;
};

exports.reset = () => {
    const data = [{ ids: 0 }];
    fs.writeFileSync("./database/status.json", JSON.stringify(data));
};

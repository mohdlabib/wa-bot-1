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
            msg: "game not started yet. type *-help* or *-menu* to see valid commands.",
        };
    }
};

exports.setStatus = (grup, act, game) => {
    const file = fs.readFileSync("./database/status.json");
    let data = JSON.parse(file);
    let id = data[0].ids;
    const temp = data.filter((obj) => obj.grup == grup && obj.game == game);
    let status = { status: true, msg: "", game };
    switch (game) {
        case "fam":
            status.msg = "*FAMILY100*\n\n";
            break;
        case "lontong":
            status.msg = "*QUIZ LONTONG*\n\n";
            break;
        case "caklontong":
            status.msg = "*CAK LONTONG*\n\n";
            break;
        case "tebakkata":
            status.msg = "*TEBAK KATA*\n\n";
            break;
        case "tebaklirik":
            status.msg = "*TEBAK LIRIK*\n\n";
            break;
        case "tebakkalimat":
            status.msg = "*TEBAK KALIMAT*\n\n";
            break;
    }
    if (act == 1) {
        if (temp.length) {
            status.status = false;
            status.msg += `the game is still going..\ntype *-stop* to stop the game`;
            return status;
        }
        data.push({ id, grup, game });
        id++;
        data.splice(0, 1, { ids: id });
    } else {
        if (!temp.length) {
            status.status = false;
            status.msg += `game not started yet. type *-help* or *-menu* to see valid commands.`;
            return status;
        }
        data = data.filter((obj) => temp[0].id != obj.id);
        status.msg += `game stopped.`;
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

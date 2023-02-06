const { default: axios } = require("axios");
const { rand, getStatus, setStatus } = require("./status");
exports.TIME = 90;
const REWARD = 25;
let caklontong = [];
let tebakkata = [];
let tebaklirik = [];
let tebakkalimat = [];
let times = [];
let interval = null;

exports.caklontong = async (grup) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.xyz/api/game/caklontong?apikey=" +
                    process.env.Alpha_API_KEY
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    reject({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result.data;
                const text =
                    "*CAK LONTONG*\n\n" +
                    response.soal +
                    "\n\n" +
                    clue(response.jawaban) +
                    "\n" +
                    REWARD +
                    " point | " +
                    this.TIME +
                    "s";

                caklontong.push({
                    grup: grup,
                    answer: response.jawaban,
                    desc: response.desc,
                    reward: REWARD,
                });
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                reject({
                    play: false,
                    text: err,
                });
            });
    });
};

exports.tebakkata = async (grup) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.xyz/api/game/tebakkata?apikey=" +
                    process.env.Alpha_API_KEY
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    reject({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                // clue(response.jawaban) +
                // "\n" +
                const text =
                    "*TEBAK KATA*\n\nclue : " +
                    response.soal +
                    "\n\n" +
                    REWARD +
                    " point | " +
                    this.TIME +
                    "s";

                tebakkata.push({
                    grup: grup,
                    answer: response.jawaban,
                    reward: REWARD,
                });
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                reject({
                    play: false,
                    text: err,
                });
            });
    });
};

exports.tebaklirik = async (grup) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.xyz/api/game/tebaklirik?apikey=" +
                    process.env.Alpha_API_KEY
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    reject({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                const text =
                    "*TEBAK LIRIK*\n\n" +
                    response.soal +
                    "\n\n" +
                    REWARD +
                    " point | " +
                    this.TIME +
                    "s";

                tebaklirik.push({
                    grup: grup,
                    answer: response.jawaban,
                    reward: REWARD,
                });
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                reject({
                    play: false,
                    text: err,
                });
            });
    });
};

exports.tebakkalimat = async (grup) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.xyz/api/game/tebakkalimat?apikey=" +
                    process.env.Alpha_API_KEY
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    reject({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                const text =
                    "*TEBAK KALIMAT*\n\n" +
                    response.soal +
                    "\n\n" +
                    REWARD +
                    " point | " +
                    this.TIME +
                    "s";

                tebakkalimat.push({
                    grup: grup,
                    answer: response.jawaban,
                    reward: REWARD,
                });
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                reject({
                    play: false,
                    text: err,
                });
            });
    });
};

exports.getAnsWard = (grup, game) => {
    let gd = [];
    switch (game) {
        case "caklontong":
            gd = caklontong;
            break;
        case "tebakkata":
            gd = tebakkata;
            break;
        case "tebaklirik":
            gd = tebaklirik;
            break;
        case "tebakkalimat":
            gd = tebakkalimat;
            break;
    }
    return gd.filter((l) => l.grup == grup)[0];
};

exports.destroy = (grup, game) => {
    if (game == "caklontong") {
        caklontong = caklontong.filter((l) => l.grup != grup);
    } else if (game == "tebakkata") {
        tebakkata = tebakkata.filter((l) => l.grup != grup);
    } else if (game == "tebaklirik") {
        tebaklirik = tebaklirik.filter((l) => l.grup != grup);
    } else if (game == "tebakkalimat") {
        tebakkalimat = tebakkalimat.filter((l) => l.grup != grup);
    }
    clearTimer(grup + game);
};

exports.end = (grup, chat, gc) => {
    const soal = this.getAnsWard(grup, gc);
    setStatus(grup, 0, gc);
    if (gc == "caklontong")
        chat.sendMessage(
            `*CAK LONTONG*\n\ntimes up!\n\nanswer : ${
                soal.answer
            }\ndesc : ${soal.desc.toLowerCase()}`
        );
    else if (gc == "tebakkata")
        chat.sendMessage(
            `*TEBAK KATA*\n\ntimes up!\n\nanswer : ${soal.answer}`
        );
    else if (gc == "tebaklirik")
        chat.sendMessage(
            `*TEBAK LIRIK*\n\ntimes up!\n\nanswer : ${soal.answer}`
        );
    else if (gc == "tebakkalimat")
        chat.sendMessage(
            `*TEBAK KALIMAT*\n\ntimes up!\n\nanswer : ${soal.answer}`
        );
    this.destroy(grup, gc);
};

exports.timer = (grup, chat, gc) => {
    const i = grup + gc;
    times[i] = 0;
    interval = setInterval(() => {
        times[i]++;
        if (times[i] >= this.TIME) {
            const game = getStatus(grup);
            if (game.status) {
                game.game.forEach((g) => {
                    if (g == gc) {
                        this.end(grup, chat, gc);
                        clearTimer(i);
                    }
                });
            }
        }
    }, 1000);
};

function clearTimer(i) {
    clearInterval(interval);
    interval = null;
    times[i] = 0;
}

function clue(ans) {
    let c = ans.length <= 4 ? 1 : ans.length <= 7 ? 2 : 3;
    let ret = [];
    for (let i = 0; i < ans.length; i++) {
        if (ans[i] == " ") ret.push("  ");
        else {
            ret.push("_ ");
            if (c > 0) {
                if (rand(0, 1) == 0 && i != ans.length - 1) continue;
                ret.splice(i, 1, `${ans[i]} `);
                c--;
            }
        }
    }
    return ret.join("");
}

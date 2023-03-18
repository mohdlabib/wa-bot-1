const { default: axios } = require("axios");
const { rand, getStatus, setStatus } = require("./status");
const fs = require("fs");
const { AlphaKey } = require("../utils/apikey");
exports.TIME = 90;
let times = [];
let interval = null;

exports.caklontong = async (grup) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/caklontong?apikey=" +
                    AlphaKey()
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
                response.reward = rand(25, 50);
                const text =
                    "*CAK LONTONG*\n\n" +
                    response.soal +
                    "\n\n" +
                    clue(response.jawaban) +
                    "\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "caklontong", response);
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
                "https://api.zeeoneofc.my.id/api/game/tebakkata?apikey=" +
                    AlphaKey()
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
                response.reward = rand(5, 25);
                const text =
                    "*TEBAK KATA*\n\nclue : " +
                    response.soal +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "tebakkata", response);
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

exports.tekateki = async (grup) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/tekateki?apikey=" +
                    AlphaKey()
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
                response.reward = rand(10, 50);
                const text =
                    "*TEKATEKI*\n\nclue : " +
                    response.soal +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "tekateki", response);
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
                "https://api.zeeoneofc.my.id/api/game/tebaklirik?apikey=" +
                    AlphaKey()
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
                response.reward = rand(10, 50);
                const text =
                    "*TEBAK LIRIK*\n\n" +
                    response.soal +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "tebaklirik", response);
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
                "https://api.zeeoneofc.my.id/api/game/tebakkalimat?apikey=" +
                    AlphaKey()
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
                response.reward = rand(5, 30);
                const text =
                    "*TEBAK KALIMAT*\n\n" +
                    response.soal +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "tebakkalimat", response);
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
    return getGames(grup, game);
};

exports.destroy = (grup, game) => {
    deleteGames(grup, game);
    clearTimer(grup + game);
};

exports.end = (grup, chat, gc) => {
    const soal = this.getAnsWard(grup, gc);
    setStatus(grup, 0, gc);
    if (gc == "caklontong")
        chat.sendMessage(
            `*CAK LONTONG*\n\nwaktu habis!\n\njawaban : ${
                soal.answer
            }\ndeskripsi : ${soal.desc.toLowerCase()}`
        );
    else if (gc == "tebakkata")
        chat.sendMessage(
            `*TEBAK KATA*\n\nwaktu habis!\n\njawaban : ${soal.answer}`
        );
    else if (gc == "tebaklirik")
        chat.sendMessage(
            `*TEBAK LIRIK*\n\nwaktu habis!\n\njawaban : ${soal.answer}`
        );
    else if (gc == "tekateki")
        chat.sendMessage(
            `*TEKATEKI*\n\nwaktu habis!\n\njawaban : ${soal.answer}`
        );
    else if (gc == "tebakkalimat")
        chat.sendMessage(
            `*TEBAK KALIMAT*\n\nwaktu habis!\n\njawaban : ${soal.answer}`
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

const setGames = (grup, game, response) => {
    const file = fs.readFileSync("./database/games.json");
    let data = JSON.parse(file);
    data.push({
        grup,
        game,
        question: response.soal,
        answer: response.jawaban,
        desc: response.desc,
        reward: response.reward,
    });
    fs.writeFileSync("./database/games.json", JSON.stringify(data));
};

const getGames = (grup, game) => {
    const file = fs.readFileSync("./database/games.json");
    let data = JSON.parse(file);
    data = data.filter((d) => d.grup == grup && d.game == game);
    if (!data.length) return { answer: "", reward: 0, desc: "", grup, game };
    return data[0];
};

const deleteGames = (grup, game) => {
    const file = fs.readFileSync("./database/games.json");
    let data = JSON.parse(file);
    const ndata = data.filter((d) => d.grup == grup && d.game == game);
    data = data.filter((d) => d.grup != grup && d.game != game);
    if (!ndata.length) return false;
    fs.writeFileSync("./database/games.json", JSON.stringify(data));
    return true;
};

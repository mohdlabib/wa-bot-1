const { default: axios } = require("axios");
const { rand, getStatus, setStatus, gameTitle } = require("./status");
const fs = require("fs");
const compareStrings = require("compare-strings");
const { AlphaKey } = require("../utils/apikey");
const { premiumNotifyText } = require("../utils/autoMsg");
exports.TIME = 90;
let times = [];
let interval = null;

exports.similarity = (s1, s2) => {
    return compareStrings(s1, s2);
};

exports.caklontong = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/caklontong?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(25, 50);
                const text =
                    "*✱ CAK LONTONG ✱*\n\n" +
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
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.tebakkata = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/tebakkata?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(5, 25);
                const text =
                    "*✱ TEBAK KATA ✱*\n\n*Hint :* " +
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
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.tekateki = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/tekateki?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(10, 50);
                const text =
                    "*✱ TEKATEKI ✱*\n\n*Hint :* " +
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
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.tebaklirik = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/tebaklirik?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(10, 50);
                const text =
                    "*✱ TEBAK LIRIK ✱*\n\n" +
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
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.tebakkalimat = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/tebakkalimat?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(5, 30);
                const text =
                    "*✱ TEBAK KALIMAT ✱*\n\n" +
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
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.tebakbendera = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/tebakbendera2?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.name.trim();
                response.reward = rand(30, 100);
                const text =
                    "*✱ TEBAK BENDERA ✱*\n\nNegara apakah ini?" +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "tebakbendera", response);
                resolve({
                    play: true,
                    text,
                    img: response.img,
                });
            })
            .catch((err) => {
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.susunkata = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/susunkata?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(10, 30);
                const text =
                    "*✱ SUSUN KATA ✱*\n\n" +
                    response.soal +
                    "\n*Tipe :* " +
                    response.tipe +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "susunkata", response);
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.asahotak = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/asahotak?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(20, 50);
                const text =
                    "*✱ ASAH OTAK ✱*\n\n" +
                    response.soal +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "asahotak", response);
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.tebakkimia = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/tebakkimia?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.unsur.trim();
                response.reward = rand(20, 50);
                const text =
                    "*✱ TEBAK KIMIA ✱*\n\n*Lambang :* " +
                    response.lambang +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "tebakkimia", response);
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.siapakahaku = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/siapakahaku?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(10, 30);
                const text =
                    "*✱ SIAPAKAH AKU ✱*\n\n" +
                    response.soal +
                    "\n\n" +
                    clue(response.jawaban) +
                    "\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "siapakahaku", response);
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
            });
    });
};

exports.tebaktebakan = async (grup, user) => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                "https://api.zeeoneofc.my.id/api/game/tebaktebakan?apikey=" +
                    AlphaKey(user)
            )
            .then((res) => {
                let response = res.data;
                if (response.status != 200) {
                    resolve({
                        play: false,
                        text: response.message,
                    });
                }
                response = response.result;
                response.jawaban = response.jawaban.trim();
                response.reward = rand(10, 30);
                const text =
                    "*✱ TEBAK-TEBAKAN ✱*\n\n" +
                    response.soal +
                    "\n\n" +
                    response.reward +
                    " point | " +
                    this.TIME +
                    "s";

                setGames(grup, "tebaktebakan", response);
                resolve({
                    play: true,
                    text,
                });
            })
            .catch((err) => {
                if (err.response.status == 403) {
                    resolve({
                        play: false,
                        text: premiumNotifyText,
                    });
                } else {
                    resolve({
                        play: false,
                        text: err,
                    });
                }
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
    let text = `${gameTitle(gc)}WAKTU HABIS!\n\nJawaban : ${soal.answer}`;
    if (soal.desc) text += `\ndeskripsi : ${soal.desc.toLowerCase()}`;
    chat.sendMessage(text);
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
    let index = -1;
    data.filter((d, i) => {
        if (d.grup == grup && d.game == game) index = i;
    });
    const nd = {
        grup,
        game,
        question: response.soal,
        answer: response.jawaban,
        desc: response.deskripsi,
        reward: response.reward,
        tipe: response.tipe,
    };
    if (index == -1) {
        data.push(nd);
    } else {
        data.splice(index, 1, nd);
    }
    fs.writeFileSync("./database/games.json", JSON.stringify(data));
};

const getGames = (grup, game) => {
    const file = fs.readFileSync("./database/games.json");
    let data = JSON.parse(file);
    data = data.filter((d) => d.grup == grup && d.game == game);
    if (!data.length)
        return { answer: "", reward: 0, desc: "", grup, game, name: "" };
    return data[0];
};

const deleteGames = (grup, game) => {
    const file = fs.readFileSync("./database/games.json");
    let data = JSON.parse(file);
    const ndata = data.filter((d) => d.grup == grup && d.game == game);
    for (let i = 0; i < data.length; i++) {
        if (data[i].grup == grup && data[i].game == game) {
            data.splice(i, 1);
        }
    }
    if (!ndata.length) return false;
    fs.writeFileSync("./database/games.json", JSON.stringify(data));
    return true;
};

exports.interact = (grup, game, message, lb) => {
    const soal = this.getAnsWard(grup, game);
    // console.log(soal);
    const sim = this.similarity(soal.answer, message.body);
    if (sim == 1) {
        let text = `${gameTitle(game)}Jawaban benar. +${soal.reward} point.`;
        if (soal.desc) text += `\n\nDeskripsi : ${soal.desc.toLowerCase()}`;
        message.reply(text);
        setStatus(grup, 0, game);
        this.destroy(grup, game);
        lb.setLB(
            grup,
            {
                user: `@${message.author.split("@")[0]}`,
                contact,
            },
            soal.reward
        );
    } else if (sim >= 0.7) {
        message.reply("Sedikit lagi!!");
    } else if (sim >= 0.4) {
        message.reply("Bisa jadi!!");
    }
};

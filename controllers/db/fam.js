const fs = require("fs");
const status = require("./status");
const GAME = "fam";
const TIME = 120;
let times = [];

exports.setSoal = (grup) => {
    const file = fs.readFileSync("./database/" + GAME + ".json");
    let data = JSON.parse(file);
    const { question, answer, reward } = data[status.rand(1, data.length - 1)];
    data[0].playing.push({
        grup,
        question,
        answer,
        reward,
    });
    fs.writeFileSync("./database/" + GAME + ".json", JSON.stringify(data));
};

exports.upSoal = (soal) => {
    const file = fs.readFileSync("./database/" + GAME + ".json");
    let data = JSON.parse(file);
    let playing = data[0].playing.filter((obj) => obj.grup != soal.grup);
    data.splice(0, 1, { playing });
    data[0].playing.push({
        grup: soal.grup,
        question: soal.question,
        answer: soal.answer,
        reward: soal.reward,
    });
    fs.writeFileSync("./database/" + GAME + ".json", JSON.stringify(data));
};

exports.delSoal = (grup) => {
    const file = fs.readFileSync("./database/" + GAME + ".json");
    let data = JSON.parse(file);
    let playing = data[0].playing.filter((obj) => obj.grup != grup);
    data.splice(0, 1, { playing });
    fs.writeFileSync("./database/" + GAME + ".json", JSON.stringify(data));
};

exports.getSoal = (idgrup) => {
    const file = fs.readFileSync("./database/" + GAME + ".json");
    let data = JSON.parse(file);
    data = data[0].playing.filter((obj) => obj.grup == idgrup);
    if (!data.length) {
        return {
            play: false,
            msg: "sorry, question not found.\n\ntype *-fam* to restart the game.",
        };
    }
    const { grup, question, answer, reward } = data[0];
    return {
        play: true,
        msg: `*Family 100*\n\n${question}\n\n${answer.length} answer(s) | ${TIME}s\nreward: ${reward} point`,
        grup,
        answer,
        reward,
    };
};

exports.setStatus = (grup, act) => {
    return status.setStatus(grup, act, GAME);
};

exports.writeSoal = (text) => {
    if (text.length != 3)
        return "ex. to add a question for Family100.\n\n-qdd\n\nfam\n\n'question'\n\n'ans1, ans2, ans3, ...'\n\n'price'";
    const file = fs.readFileSync("./database/" + GAME + ".json");
    let data = JSON.parse(file);
    data.push({
        question: text[0],
        answer: setJawaban(text[1]),
        reward: parseInt(text[2]),
    });
    fs.writeFileSync("./database/" + GAME + ".json", JSON.stringify(data));
    return `successfully added a new question for the Family100 game.\n\nthank you for helping me develop this bot.`;
};

exports.end = (grup, chat, act) => {
    if (act == -1) {
        chat.sendMessage("times up!\n\n" + this.setStatus(grup, 0).msg);
    }
    const soal = this.getSoal(grup);
    if (soal.answer.length > 0) {
        let text = `*Family100 ended*\n\n*${soal.answer.length} answer(s) remaining*`;
        soal.answer.forEach((j) => (text += `\n- ${j}`));
        chat.sendMessage(text);
    }
    this.delSoal(grup);
};

exports.timer = (grup, chat) => {
    times[grup] = 0;
    const val = setInterval(() => {
        times[grup]++;
        if (times[grup] >= TIME) {
            clearInterval(val);
            times[grup] = 0;
            const game = status.getStatus(grup);
            if (game.status) {
                game.game.forEach((g) => {
                    if (g == GAME) this.end(grup, chat, -1);
                });
            }
        }
    }, 1000);
};

function setJawaban(text) {
    let ans = text.split(",");
    ans = ans.map((a) => a.trim());
    return ans;
}

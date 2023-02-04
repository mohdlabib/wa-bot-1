const fs = require("fs");
const status = require("./status");
const GAME = "lontong";
const HADIAH = 10;
const TIME = 90;
let times = [];

exports.setSoal = (grup) => {
    const file = fs.readFileSync("./database/" + GAME + ".json");
    let data = JSON.parse(file);
    const { question, answer } = data[status.rand(1, data.length - 1)];
    data[0].playing.push({
        grup,
        question,
        answer,
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

exports.getSoal = (grup) => {
    const file = fs.readFileSync("./database/" + GAME + ".json");
    let data = JSON.parse(file);
    data = data[0].playing.filter((obj) => obj.grup == grup);
    if (!data.length) {
        return {
            play: false,
            msg: "sorry, question not found.\n\ntype *-lontong* to restart the game.",
        };
    }
    return {
        play: true,
        msg: `*Quiz Lontong*\n\n${data[0].question}\n\n${TIME}s\nreward: ${HADIAH} point`,
        answer: data[0].answer,
        reward: HADIAH,
    };
};

exports.setStatus = (grup, act) => {
    return status.setStatus(grup, act, GAME);
};

exports.writeSoal = (text) => {
    if (text.length != 2)
        return "ex. to add a question for Quiz Lontong.\n\n-qdd\n\nlontong\n\n'question'\n\n'answer'";
    const file = fs.readFileSync("./database/" + GAME + ".json");
    let data = JSON.parse(file);
    data.push({
        question: text[0],
        answer: text[1],
    });
    fs.writeFileSync("./database/" + GAME + ".json", JSON.stringify(data));
    return `successfully added a new question for the Quiz Lontong game.\n\nthank you for helping me develop this bot.`;
};

exports.end = (grup, chat, act) => {
    if (act == -1)
        chat.sendMessage("times up!\n\n" + this.setStatus(grup, 0).msg);

    const soal = this.getSoal(grup);
    chat.sendMessage(`*Quiz Lontong ended*\n\nanswer : ${soal.answer}`);
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

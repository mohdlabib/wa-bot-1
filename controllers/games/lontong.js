const fs = require("fs");
const status = require("./status");
const HADIAH = 10;
exports.GAME = "lontong";
exports.TIME = 90;

exports.setSoal = (grup) => {
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
    let data = JSON.parse(file);
    const { question, answer } = data[status.rand(1, data.length - 1)];
    data[0].playing.push({
        grup,
        question,
        answer,
    });
    fs.writeFileSync("./database/" + this.GAME + ".json", JSON.stringify(data));
};

exports.delSoal = (grup) => {
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
    let data = JSON.parse(file);
    let playing = data[0].playing.filter((obj) => obj.grup != grup);
    data.splice(0, 1, { playing });
    fs.writeFileSync("./database/" + this.GAME + ".json", JSON.stringify(data));
};

exports.getSoal = (grup) => {
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
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
        msg: `*QUIZ LONTONG*\n\n${data[0].question.toLowerCase()}\n\n${HADIAH} point | ${
            this.TIME
        }s`,
        answer: data[0].answer,
        reward: HADIAH,
    };
};

exports.setStatus = (grup, act) => {
    return status.setStatus(grup, act, this.GAME);
};

exports.writeSoal = (text) => {
    if (text.length != 2)
        return "ex. to add a question for Quiz Lontong.\n\n-qdd\n\nlontong\n\n'question'\n\n'answer'";
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
    let data = JSON.parse(file);
    data.push({
        question: text[0],
        answer: text[1],
    });
    fs.writeFileSync("./database/" + this.GAME + ".json", JSON.stringify(data));
    return `successfully added a new question for Quiz Lontong.\n\nthank you for helping me develop this bot.`;
};

exports.end = (grup, chat, act) => {
    let text = "";
    if (act == -1) text = "times up! " + this.setStatus(grup, 0).msg + "\n\n";

    const soal = this.getSoal(grup);
    chat.sendMessage(
        `*QUIZ LONTONG*\n\n${text}answer : ${soal.answer.toLowerCase()}`
    );
    this.delSoal(grup);
};

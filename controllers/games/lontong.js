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
            msg: "Maaf, soal tidak ditemukan.\n\nKetik *-lontong* untuk restart game.",
        };
    }
    return {
        play: true,
        msg: `*>> QUIZ LONTONG <<*\n\n${data[0].question.toLowerCase()}\n\n${HADIAH} point | ${
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
        return "Cara untuk menambah soal game Quiz Lontong.\n\n-qdd\n\nlontong\n\n'soal'\n\n'jawaban'";
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
    let data = JSON.parse(file);
    data.push({
        question: text[0],
        answer: text[1],
    });
    fs.writeFileSync("./database/" + this.GAME + ".json", JSON.stringify(data));
    return `Berhasil menambah soal baru untuk game Quiz Lontong.\n\nTerimakasih telah membantu mengembangkan bot ini.`;
};

exports.end = (grup, chat, act) => {
    let text = "";
    this.setStatus(grup, 0);
    if (act == -1) text = "WAKTU HABIS!\n\n";
    const soal = this.getSoal(grup);
    chat.sendMessage(
        `${status.gameTitle(
            this.GAME
        )}${text}jawaban : ${soal.answer.toLowerCase()}`
    );
    this.delSoal(grup);
};

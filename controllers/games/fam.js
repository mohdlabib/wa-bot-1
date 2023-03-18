const fs = require("fs");
const status = require("./status");
exports.GAME = "fam";
exports.TIME = 120;

exports.setSoal = (grup) => {
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
    let data = JSON.parse(file);
    const { question, answer, reward } = data[status.rand(1, data.length - 1)];
    data[0].playing.push({
        grup,
        question,
        answer,
        reward,
    });
    fs.writeFileSync("./database/" + this.GAME + ".json", JSON.stringify(data));
};

exports.upSoal = (soal) => {
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
    let data = JSON.parse(file);
    let playing = data[0].playing.filter((obj) => obj.grup != soal.grup);
    data.splice(0, 1, { playing });
    data[0].playing.push({
        grup: soal.grup,
        question: soal.question,
        answer: soal.answer,
        reward: soal.reward,
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

exports.getSoal = (idgrup) => {
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
    let data = JSON.parse(file);
    data = data[0].playing.filter((obj) => obj.grup == idgrup);
    if (!data.length) {
        return {
            play: false,
            msg: "maaf, soal tidak ditemukan.\n\nketik *-fam* untuk restart game.",
        };
    }
    const { grup, question, answer, reward } = data[0];
    return {
        play: true,
        msg: `*FAMILY100*\n\n${question}\n\n${answer.length} jawaban | ${reward} point | ${this.TIME}s`,
        grup,
        answer,
        reward,
    };
};

exports.setStatus = (grup, act) => {
    return status.setStatus(grup, act, this.GAME);
};

exports.writeSoal = (text) => {
    if (text.length != 3)
        return "ex. untuk menambah soal game Family100.\n\n-qdd\n\nfam\n\n'soal'\n\n'jawaban1, jawaban2, jawaban3, ...'\n\n'hadiah'\n\nnb: tanpa tanda kutip.";
    const file = fs.readFileSync("./database/" + this.GAME + ".json");
    let data = JSON.parse(file);
    data.push({
        question: text[0],
        answer: setJawaban(text[1]),
        reward: parseInt(text[2]),
    });
    fs.writeFileSync("./database/" + this.GAME + ".json", JSON.stringify(data));
    return `berhasil menambah soal baru untuk game Family100.\n\nterimakasih telah membantu mengembangkan bot ini.`;
};

exports.end = (grup, chat, act) => {
    let extra = "";
    this.setStatus(grup, 0);
    if (act == -1) {
        extra = "times up!\n\n";
    }
    const soal = this.getSoal(grup);
    if (soal.answer.length > 0) {
        let text = `*FAMILY100*\n\n${extra}*${soal.answer.length} answer(s) remaining*`;
        soal.answer.forEach((j) => (text += `\n- ${j}`));
        chat.sendMessage(text);
    }
    this.delSoal(grup);
};

function setJawaban(text) {
    let ans = text.split(",");
    ans = ans.map((a) => a.trim());
    return ans;
}

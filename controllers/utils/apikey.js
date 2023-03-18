const fs = require("fs");

let alphakey = process.env.Alpha_API_KEY0;
let alphacount = 0;

exports.AlphaKey = (x) => {
    if (x == -1) this.AlphaCount(0);
    else this.AlphaCount(-1);
    if (alphacount >= 15) {
        alphakey = process.env.Alpha_API_KEY1;
    } else if (alphacount >= 30) {
        alphakey = process.env.Alpha_API_KEY2;
    } else {
        alphakey = process.env.Alpha_API_KEY0;
    }
    return alphakey;
};

exports.AlphaCount = (x) => {
    const file = fs.readFileSync("./database/apikey.json");
    let data = JSON.parse(file);
    alphacount = data.count;
    if (x) {
        if (x == -1) alphacount++;
        else alphacount = x;
        data.count = alphacount;
        fs.writeFileSync("./database/apikey.json", JSON.stringify(data));
    }
    let ret = 45 - alphacount;
    return ret > 0 ? ret : 0;
};

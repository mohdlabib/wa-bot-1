const fs = require("fs");
// const MAX = 15;
let alphakey = process.env.Alpha_API_KEY0;
let alphacount = 0;

exports.AlphaKey = (user, x) => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    let index = 0;
    data.filter((d, i) => {
        if (Object.values(d.user).indexOf(user) > -1) index = i;
    });
    if (x == -1) this.AlphaCount(index, data[index].name);
    else this.AlphaCount(index, 1);
    if (index == 0) {
        if (this.AlphaCount(index) <= data[index].limit / 2) {
            alphakey = data[index].key[1];
        } else {
            alphakey = data[index].key[0];
        }
    } else {
        alphakey = data[index].key;
    }
    return alphakey;
};

exports.AlphaCount = (index, x, user) => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    if (user) {
        index = 0;
        data.filter((d, i) => {
            if (Object.values(d.user).indexOf(user) > -1) index = i;
        });
        alphacount = data[index].count;
        if (x == "all") {
            data.map((d) => {
                d.count = 0;
            });
        } else if (x == data[index].name) {
            data[index].count = 0;
        }
    } else {
        alphacount = data[index].count;
        if (x) {
            if (x == 1) alphacount++;
            else if (x == data[index].name) alphacount = 0;
            data[index].count = alphacount;
        }
    }
    fs.writeFileSync("./database/api.json", JSON.stringify(data));
    return {
        hit: data[index].limit - alphacount,
        user: data[index].user,
        name: data[index].name,
    };
};

exports.PremiumList = () => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    data.splice(0, 1);
    return data;
};

// exports.AlphaKey = (x) => {
//     if (x == -1) this.AlphaCount(1);
//     else this.AlphaCount(-1);
//     if (this.AlphaCount() <= MAX) {
//         alphakey = process.env.Alpha_API_KEY2;
//     } else if (this.AlphaCount() <= MAX * 2) {
//         alphakey = process.env.Alpha_API_KEY1;
//     } else {
//         alphakey = process.env.Alpha_API_KEY0;
//     }
//     return alphakey;
// };

// exports.AlphaCount = (x) => {
//     const file = fs.readFileSync("./database/apikey.json");
//     let data = JSON.parse(file);
//     alphacount = data.count;
//     if (x) {
//         if (x == -1) alphacount++;
//         else alphacount = x;
//         data.count = alphacount;
//         fs.writeFileSync("./database/apikey.json", JSON.stringify(data));
//     }
//     let ret = MAX * 3 - alphacount;
//     return ret > 0 ? ret : 0;
// };

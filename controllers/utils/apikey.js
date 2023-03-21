const fs = require("fs");
let alphakey;
let alphacount = 0;

exports.AlphaKey = (user, x) => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    let index = 1;
    data.filter((d, i) => {
        if (Object.values(d.user).indexOf(user) > -1) index = i;
    });
    if (x == -1) this.AlphaCount(index, data[index].name);
    else this.AlphaCount(index, 1);
    if (index == 1) {
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
        index = 1;
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

exports.AIKey = () => {
    const file = fs.readFileSync("./database/api.json");
    let data = JSON.parse(file);
    let aikey = data[0].key;
    return aikey;
};

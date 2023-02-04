const fs = require("fs");

exports.setLB = (grup, anggota, poin) => {
    const file = fs.readFileSync("./database/lb.json");
    let datas = JSON.parse(file);
    let i, j;
    let data = datas.filter((d, ind) => {
        if (d.grup === grup) {
            i = ind;
            return d;
        }
    });
    if (data.length) {
        let anggotas = data[0].anggota;
        data = anggotas.filter((d, ind) => {
            if (Object.values(d.anggota).indexOf(anggota.user) > -1) {
                j = ind;
                return d;
            }
        });
        if (data.length) {
            anggotas.splice(j, 1, {
                anggota,
                poin: anggotas[j].poin + poin,
            });
        } else {
            anggotas.push({ anggota, poin });
        }
        datas.splice(i, 1, { grup, anggota: anggotas });
        fs.writeFileSync("./database/lb.json", JSON.stringify(datas));
    } else {
        datas.push({ grup, anggota: [{ anggota, poin }] });
        fs.writeFileSync("./database/lb.json", JSON.stringify(datas));
    }
};

exports.getLB = (grup) => {
    const file = fs.readFileSync("./database/lb.json");
    let datas = JSON.parse(file);
    let data = datas.filter((d) => d.grup === grup);
    if (data.length) {
        const d = data[0];
        let text = `*Leaderboard*\n`;
        let mentions = [];
        d.anggota.sort((a, b) => b.poin - a.poin);
        d.anggota.forEach((d, i) => {
            text += `\n${i + 1}. ${d.anggota.user} -> ${d.poin} point`;
            mentions.push(d.anggota.contact);
        });
        return { text, mentions };
    } else {
        return {
            text: `no leaderboard found. play games to earn point and create leaderboard.\n\ntype *-help* to see valid commands`,
            mentions: [],
        };
    }
};

const dotenv = require("dotenv");
const { errai } = require("../utils/autoMsg");
const { Configuration, OpenAIApi } = require("openai");
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.ai = async (text, msg) => {
    const res = await this.chatai(text);
    if (res.error) {
        return errai(msg, res.error.message.trim());
    }

    return msg.reply(res?.choices?.[0].text.trim());
};

exports.tlid = async (text, msg) => {
    return await this.ai("translate to bahasa indonesia: " + text, msg);
};

exports.tlen = async (text, msg) => {
    return await this.ai("translate to english: " + text, msg);
};

exports.stden = async (text, msg) => {
    return await this.ai("Correct this to standard English:\n" + text, msg);
};

exports.chatai = async (text) => {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    return response.data;
};

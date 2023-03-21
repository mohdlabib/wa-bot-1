const { errai } = require("../utils/autoMsg");
const { Configuration, OpenAIApi } = require("openai");
const { AIKey } = require("../utils/apikey");

const configuration = new Configuration({
    apiKey: AIKey(),
});
const openai = new OpenAIApi(configuration);

exports.ai = async (text, msg) => {
    const res = await this.chatai(text);
    if (res) {
        if (res.error) return errai(msg, res.error.message.trim());
    }

    return msg.reply(res?.choices?.[0].text.trim());
};

exports.tlid = async (text, msg) => {
    return await this.ai("translate ke bahasa indonesia: " + text, msg);
};

exports.tlen = async (text, msg) => {
    return await this.ai("translate ke english: " + text, msg);
};

exports.stden = async (text, msg) => {
    return await this.ai("Correct this to standard English:\n" + text, msg);
};

exports.chatai = async (text) => {
    try {
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
    } catch (err) {
        console.log("error while request AI response");
        return {
            error: {
                message:
                    "maaf, ada error saat menjawab pertanyaanmu. tolong kirim ulang pesanmu.",
            },
        };
    }
};

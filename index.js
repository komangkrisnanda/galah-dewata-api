"use strict";

const request = require("request");
const cheerio = require("cheerio");
const moment = require("moment");

const BASE_URL = "https://kalenderbali.org";

const setupBot = async () => {
  console.log("Starting telegram bot...");

  const token = "6147062023:AAETTIbunext8b6LaK9EvRJ_vMdhvP0D3yk";
  let TelegramBot = require("node-telegram-bot-api");
  let bot = new TelegramBot(token, { polling: true });
  var chatOpts = {
    reply_markup: {
      keyboard: [["/dewasaayu"], ["/rerahinan"], ["/piodalan"]],
    },
    parse_mode: "Markdown",
  };

  //Dewasa Ayu
  bot.onText(/^\/dewasaayu$/, async (msg, match) => {
    let chatId = msg.chat.id;
    let resp = match[0];
    await getDewasaAyu().then((content) => {
      var text = `Dewasa Ayu (${moment(new Date()).format("DD/MM/YYYY")})\n\n`;
      content.forEach((item) => {
        text += `*${item.name}*\n\n👉 ${item.description}\n\n`;
      });
      bot.sendMessage(chatId, text, chatOpts);
    });
  });

  //Rerahinan
  bot.onText(/^\/rerahinan$/, async (msg, match) => {
    let chatId = msg.chat.id;
    let resp = match[0];
    await getRerahinan().then((content) => {
      var text = `Rerahinan (${moment(new Date()).format("MMMM YYYY")})\n\n`;
      content.forEach((item) => {
        text += `*${item.name}*\n\n👉 ${item.description}\n\n`;
      });
      bot.sendMessage(chatId, text, chatOpts);
    });
  });

  //Piodalan
  bot.onText(/^\/piodalan$/, async (msg, match) => {
    let chatId = msg.chat.id;
    let resp = match[0];
    await getPiodalan().then((content) => {
      var text = `Piodalan (${moment(new Date()).format("MMMM YYYY")})\n\n`;
      content.forEach((item) => {
        text += `*${item.name}*\n\n*${item.description}*\n\n`;

        item.temples.forEach((temple) => {
          let str = temple.toString().replace(/^\s+/, "");
          if (str != "") {
            text += `🛕 ${str}\n`;
          }
        });

        text += `\n\n`;
      });
      bot.sendMessage(chatId, text, chatOpts);
    });
  });
};

const getDewasaAyu = async () => {
  let url = `${BASE_URL}/alaayu.php`;

  let response = await new Promise((resolve, reject) => {
    request(url, function (err, res, body) {
      if (err && res.statusCode !== 200) reject(err);

      let $ = cheerio.load(body);
      let data = $("td.daftar").html().trim().split("<br>");
      data = data.filter((item) => item != " ");
      let formatted = data
        .map((item) => {
          let splitted = item.split(".");
          if (splitted[0] && splitted[1]) {
            return {
              name: splitted[0],
              description: splitted[1].toString().replace(/^\s+/, ""),
            };
          }
        })
        .filter((item) => item !== undefined);
      resolve(formatted);
    });
  });
  console.log({
    url: url,
    response: response,
  });
  return response;
};

const getRerahinan = async () => {
  let url = `${BASE_URL}/rerainan.php`;

  let response = await new Promise((resolve, reject) => {
    request(url, function (err, res, body) {
      if (err && res.statusCode !== 200) reject(err);

      let $ = cheerio.load(body);
      let data = $("td.daftar").html().trim().split("<br>");
      data = data.filter((item) => item != " ");
      let formatted = data
        .map((item) => {
          let splitted = item.split(".");
          if (splitted[0] && splitted[1]) {
            return {
              name: splitted[0],
              description: splitted[1].toString().replace(/^\s+/, ""),
            };
          }
        })
        .filter((item) => item !== undefined);
      resolve(formatted);
    });
  });
  console.log({
    url: url,
    response: response,
  });
  return response;
};

const getPiodalan = async () => {
  let url = `${BASE_URL}/piodalan.php`;

  let response = await new Promise((resolve, reject) => {
    request(url, function (err, res, body) {
      if (err && res.statusCode !== 200) reject(err);

      let $ = cheerio.load(body);
      let data = $("td.daftar").html().trim().split("<br>");
      data = data.filter((item) => item != " ");
      let formatted = data
        .map((item) => {
          let splitted = item.split(".");
          if (splitted[0] && splitted[1]) {
            return {
              name: splitted[0],
              description: splitted[1].toString().replace(/^\s+/, ""),
              temples: splitted.splice(2),
            };
          }
        })
        .filter((item) => item !== undefined);
      resolve(formatted);
    });
  });
  console.log({
    url: url,
    response: response,
  });
  return response;
};

setupBot();

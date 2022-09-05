import TelegramApi from "node-telegram-bot-api";
import { commands, languagesPart2, languagesPart1 } from "./constants.js";
import { Translate } from "./translate.js";

export class Handlers {
  api: TelegramApi;
  translator: Translate;

  constructor(api: TelegramApi) {
    this.api = api;
    this.translator = new Translate();
    api.setMyCommands(commands);
    api.on("message", this.handleMessage.bind(this));
  }

  handleMessage(message: TelegramApi.Message) {
    this.eventDistributor(message.chat.id, message.text);
  }

  async eventDistributor(chatId: number, command?: string) {
    try {
      if (command === "/start") {
        return this.api.sendMessage(chatId, "");
      }
      if (command === "/languages") {
        this.api.sendMessage(chatId, languagesPart1.join("\n"));
        return this.api.sendMessage(chatId, languagesPart2.join("\n"));
      }
      const userText = command?.split("\n");
      if (userText && userText[0].includes("-")) {
        const prefix = userText[0].trim().slice(1).trim();
        const preparedText = userText.slice(1).join("\n");
        console.log(prefix, preparedText);
        const tr = (await this.translator.translate(prefix, preparedText)) as any;
        if (tr?.error) {
          return this.api.sendMessage(chatId, tr.error.message);
        }
        return this.api.sendMessage(chatId, `Result: ${tr[0].translations[0].text}\nTo: ${tr[0].translations[0].to}`);
      }
      return this.api.sendMessage(chatId, "Неизвестная комманда");
    } catch (err) {
      console.log(err);
      this.api.sendMessage(chatId, "Произошла ошибка");
    }
  }
}

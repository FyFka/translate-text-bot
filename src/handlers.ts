import TelegramApi from "node-telegram-bot-api";
import { COMMANDS, VALID_LANGUAGES } from "./constants.js";
import { Translate } from "./translate.js";

export class Handlers {
  api: TelegramApi;
  translator: Translate;

  constructor(api: TelegramApi) {
    this.api = api;
    this.translator = new Translate();
    api.setMyCommands(COMMANDS);
    api.on("message", this.handleMessage.bind(this));
  }

  handleMessage(message: TelegramApi.Message) {
    this.eventDistributor(message.chat.id, message.text);
  }

  async eventDistributor(chatId: number, command?: string) {
    try {
      if (command === "/start") {
        return this.handleStart(chatId);
      }
      if (command === "/languages") {
        return this.handleLanguages(chatId);
      }
      const userText = command?.split("\n");
      if (userText && userText[0].includes("-")) {
        return this.handleTranslate(chatId, userText);
      }
      return this.api.sendMessage(
        chatId,
        "Отправь мне текст, который нужно перевести.\nДля перевода текста необходимо написать код страны и текст по следующему шаблону:\n---------------------\n-{код страны}\n Текст\n---------------------\nКод страны можно посмотреть с помощью команды /languages"
      );
    } catch (err) {
      this.api.sendMessage(chatId, "Произошла критическая ошибка");
    }
  }

  handleStart(chatId: number) {
    this.api.sendMessage(
      chatId,
      "Привет, я твой личный переводчик\nЕсли захочешь перевести какой-нибудь текст, то просто напиши мне."
    );
  }

  handleLanguages(chatId: number) {
    const half = Math.ceil(VALID_LANGUAGES.length / 2);
    const firstPart = VALID_LANGUAGES.slice(0, half).join("\n");
    const secondPart = VALID_LANGUAGES.slice(half).join("\n");
    this.api.sendMessage(chatId, firstPart);
    this.api.sendMessage(chatId, secondPart);
  }

  async handleTranslate(chatId: number, text: string[]) {
    const prefix = text[0].trim().slice(1).trim();
    const preparedText = text.slice(1).join("\n");
    const tr = await this.translator.translate(prefix, preparedText);
    if (!Array.isArray(tr)) {
      return this.api.sendMessage(chatId, tr.error.message);
    }
    return this.api.sendMessage(chatId, tr[0].translations[0].text);
  }
}

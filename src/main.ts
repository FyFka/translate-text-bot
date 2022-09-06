import TelegramApi from "node-telegram-bot-api";
import { BOT_TOKEN } from "./constants.js";
import { Handlers } from "./handlers.js";

class Main {
  api: TelegramApi;
  handlers: Handlers;

  constructor() {
    this.api = new TelegramApi(BOT_TOKEN, { polling: true });
    this.handlers = new Handlers(this.api);
  }
}

new Main();

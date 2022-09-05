import dotenv from "dotenv";
import TelegramApi from "node-telegram-bot-api";
import { Handlers } from "./handlers.js";
dotenv.config();

class Main {
  api: TelegramApi;
  handlers: Handlers;

  constructor() {
    this.api = new TelegramApi(process.env.BOT_TOKEN || "EMPTY_TOKEN", { polling: true });
    this.handlers = new Handlers(this.api);
  }
}

new Main();

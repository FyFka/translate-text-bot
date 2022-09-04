import * as dotenv from "dotenv";
import TelegramApi from "node-telegram-bot-api";
dotenv.config();

class Main {
  api: TelegramApi;

  constructor() {
    this.api = new TelegramApi(process.env.BOT_TOKEN || "EMPTY_TOKEN", { polling: true });
  }
}

new Main();

import fetch from "node-fetch";
import { BASE_API_URL, RAPID_API_HOST, RAPID_API_KEY } from "./constants.js";

type ITranslateResponse = Array<{ translations: Array<{ text: string }> }> | { error: { message: string } };

export class Translate {
  async translate(target: string, text: string): Promise<ITranslateResponse> {
    const options = this._getOptions(text);
    const req = await fetch(
      `${BASE_API_URL}?to%5B0%5D=${target}&api-version=3.0&profanityAction=NoAction&textType=plain`,
      options
    );
    const translatedText = (await req.json()) as Promise<ITranslateResponse>;
    return translatedText;
  }

  _getOptions(text: string) {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
      body: JSON.stringify([{ Text: text }]),
    };
    return options;
  }
}

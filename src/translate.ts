import fetch from "node-fetch";

export class Translate {
  async translate(target: string, text: string) {
    const options = this._getOptions(text);
    console.log(process.env.BASE_API_URL, process.env.RAPID_API_KEY, process.env.RAPID_API_HOST);
    const req = await fetch(
      `${
        process.env.BASE_API_URL || "API_URL"
      }?to%5B0%5D=${target}&api-version=3.0&profanityAction=NoAction&textType=plain`,
      options
    );
    const translatedText = await req.json();
    return translatedText;
  }

  _getOptions(text: string) {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": process.env.RAPID_API_KEY || "API_KEY",
        "X-RapidAPI-Host": process.env.RAPID_API_HOST || "API_HOST",
      },
      body: JSON.stringify([{ Text: text }]),
    };
    return options;
  }
}

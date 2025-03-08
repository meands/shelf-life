import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { ChatCompletionMessageParam } from "openai/resources";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.MODEL_API_KEY,
});

export function newChat() {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: readPrompt() },
  ];

  async function appendMessage(message: { [key: string]: unknown }) {
    messages.push({ role: "user", content: JSON.stringify(message) });

    const response = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages,
    });

    messages.push({
      role: "assistant",
      content: response.choices[0].message.content,
    });

    return response.choices[0].message.content;
  }

  return appendMessage;
}

function readPrompt() {
  return fs.readFileSync(path.resolve(__dirname, "../prompt.txt"), "utf8");
}

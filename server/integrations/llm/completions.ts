import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { ChatCompletionMessageParam } from "openai/resources";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.MODEL_API_KEY,
});

export async function* streamResponse(message: { [key: string]: unknown }) {
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: readPrompt() },
    { role: "user", content: JSON.stringify(message) },
  ];

  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages,
    stream: true,
    max_completion_tokens: 500,
  });

  for await (const chunk of response) {
    if (
      chunk.choices[0].delta.content &&
      chunk.choices[0].delta.content.length > 0
    ) {
      yield frameChunk(chunk.choices[0].delta.content);
    }
  }
}

function frameChunk(data: string) {
  return `data: ${data}\n\n`;
}

function readPrompt() {
  return fs.readFileSync(path.resolve(__dirname, "../prompt.txt"), "utf8");
}

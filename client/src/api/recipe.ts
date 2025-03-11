import { EnrichedItem } from "@types";

export interface GenerateRecipesRequest {
  ingredients?: {
    name?: string;
    quantity?: number;
    expiry?: string;
  }[];
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
}

export interface GenerateRecipesResponse {
  recipes: Recipe[];
}

export async function* generateRecipes(items: EnrichedItem[]) {
  const request = {
    ingredients: items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      expiry: item.expiryDate.toISOString(),
    })),
  };

  const response = await fetch("http://localhost:3000/recipes/generate", {
    method: "POST",
    cache: "no-cache",
    keepalive: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify(request),
  });
  const reader = response.body?.getReader();
  if (!reader) return;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = new TextDecoder().decode(value);
    const subChunks = chunk.split(/\n\ndata: /);
    for (let subChunk of subChunks) {
      subChunk = subChunk.replace(/\n\n/, "");
      yield subChunk.replace(/^data: /, "");
    }
  }
}

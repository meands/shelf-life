import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../App";
import { EnrichedItem } from "@types";

interface GenerateRecipesRequest {
  ingredients: {
    name: string;
    quantity: number;
    expiry: string;
  }[];
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
}

interface GenerateRecipesResponse {
  recipes: Recipe[];
}

export const useGenerateRecipes = () => {
  return useMutation<GenerateRecipesResponse, Error, EnrichedItem[]>({
    mutationKey: ["recipes"],
    mutationFn: async (items) => {
      const request: GenerateRecipesRequest = {
        ingredients: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          expiry: item.expiryDate.toISOString(),
        })),
      };
      return axiosInstance
        .post("/recipes/generate", request)
        .then((res) => JSON.parse(res.data));
    },
  });
};

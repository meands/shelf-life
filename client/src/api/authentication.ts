import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SignInRequest, SignInResponse, WelcomeResponse } from "@shared/types";

const API_URL = "http://localhost:3000";

export const useSignIn = () => {
  return useMutation<SignInResponse, Error, SignInRequest>({
    mutationFn: async (credentials) => {
      const response = await axios.post(`${API_URL}/signIn`, credentials);
      return response.data;
    },
  });
};

export const useWelcome = () => {
  return useQuery<WelcomeResponse, Error>({
    queryKey: ["welcome"],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/welcome`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    },
  });
};

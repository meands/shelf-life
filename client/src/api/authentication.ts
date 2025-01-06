import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:3000";

interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  token: string;
  message: string;
}

interface WelcomeResponse {
  message: string;
}

export const useSignIn = () => {
  return useMutation<SignInResponse, Error, SignInCredentials>({
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

import { useMutation, useQuery } from "@tanstack/react-query";
import { SignInRequest, SignInResponse, WelcomeResponse } from "@shared/types";
import { axiosInstance } from "../App";

export const useSignIn = () => {
  return useMutation<SignInResponse, Error, SignInRequest>({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post("/signIn", credentials);
      return response.data;
    },
  });
};

export const useWelcome = () => {
  return useQuery<WelcomeResponse, Error>({
    queryKey: ["welcome"],
    queryFn: async () => {
      const response = await axiosInstance.get("/welcome");
      return response.data;
    },
  });
};

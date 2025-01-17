import { useMutation, useQuery } from "@tanstack/react-query";
import { SignInRequest, SignInResponse } from "@shared/types";
import { axiosInstance } from "../App";
import { User } from "@prisma/client";

interface VerifyResponse {
  user: User;
  message: string;
}

export const useSignIn = () => {
  return useMutation<SignInResponse, Error, SignInRequest>({
    mutationFn: async (credentials) => {
      const response = await axiosInstance.post("/signIn", credentials);
      return response.data;
    },
  });
};

export const useVerifyToken = () => {
  return useQuery<VerifyResponse>({
    queryKey: ["verify"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users/verify");
      return response.data;
    },
    retry: false,
    enabled: !!localStorage.getItem("token"),
  });
};

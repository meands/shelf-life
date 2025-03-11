import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "@expiry-tracker/shared/types";
import { axiosInstance } from "../App";
import { User } from "@prisma/client";
export const useGetUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axiosInstance.get("/users").then((res) => res.data),
  });
};

export const useGetUser = (id: number) => {
  return useQuery<User>({
    queryKey: ["users", id],
    queryFn: () => axiosInstance.get(`/users/${id}`).then((res) => res.data),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUser: CreateUserRequest) =>
      axiosInstance.post("/users", newUser).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedUser: UpdateUserRequest) =>
      axiosInstance
        .put(`/users/${updatedUser.id}`, updatedUser)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(`/users/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

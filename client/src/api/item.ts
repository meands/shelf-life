import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Item } from "@shared/types";
import { axiosInstance } from "../App";

export const useItems = () => {
  return useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: () => axiosInstance.get("/items").then((res) => res.data),
  });
};

export const useItem = (id: number) => {
  return useQuery<Item>({
    queryKey: ["items", id],
    queryFn: () => axiosInstance.get(`/items/${id}`).then((res) => res.data),
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: Omit<Item, "id" | "notes"> & { notes: string[] }) =>
      axiosInstance.post("/items", newItem).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedItem: Omit<Item, "notes"> & { notes: string[] }) =>
      axiosInstance
        .put(`/items/${updatedItem.id}`, updatedItem)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(`/items/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../App";
import { Item } from "@prisma/client";
import { CreateItemRequest, ItemWithNotesAndLabels } from "@types";

export const useItems = () => {
  return useQuery<ItemWithNotesAndLabels[]>({
    queryKey: ["items"],
    queryFn: () => axiosInstance.get("/items").then((res) => res.data),
  });
};

export const useItem = (id: number) => {
  return useQuery<ItemWithNotesAndLabels>({
    queryKey: ["items", id],
    queryFn: () => axiosInstance.get(`/items/${id}`).then((res) => res.data),
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: CreateItemRequest) =>
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

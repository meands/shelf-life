import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../App";
import { CreateItemRequest, UpdateItemRequest } from "@shared/types";
import { EnrichedItem } from "@types";

export const useItems = () => {
  return useQuery<EnrichedItem[]>({
    queryKey: ["items"],
    queryFn: () =>
      axiosInstance.get("/items").then((res) =>
        // @ts-expect-error
        // TODO: item is jsonified item with notes and labels and reminder, so date becomes string etc - casting for now but need to think about this
        res.data.map((item) => ({
          ...item,
          expiryDate: new Date(item.expiryDate),
        }))
      ),
  });
};

export const useItem = (id: number) => {
  return useQuery<EnrichedItem>({
    queryKey: ["items", id],
    queryFn: () =>
      axiosInstance.get(`/items/${id}`).then((res) => ({
        ...res.data,
        expiryDate: new Date(res.data.expiryDate),
      })),
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: CreateItemRequest) =>
      axiosInstance.post("/items", newItem).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedItem: UpdateItemRequest) =>
      axiosInstance
        .put(`/items/${updatedItem.id}`, updatedItem)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(`/items/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

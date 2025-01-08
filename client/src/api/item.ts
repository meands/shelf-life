import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Label } from "./label";

const API_URL = "http://localhost:3000/items";

export interface Item {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  expiryType: string;
  labels: Label[];
  notes: string[];
}

export const useItems = () => {
  return useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: () => axios.get(API_URL).then((res) => res.data),
  });
};

export const useItem = (id: number) => {
  return useQuery<Item>({
    queryKey: ["items", id],
    queryFn: () => axios.get(`${API_URL}/${id}`).then((res) => res.data),
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: Omit<Item, "id">) =>
      axios.post(API_URL, newItem).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedItem: Item) =>
      axios
        .put(`${API_URL}/${updatedItem.id}`, updatedItem)
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
      axios.delete(`${API_URL}/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

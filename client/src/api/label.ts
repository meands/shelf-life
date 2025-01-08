import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Label {
  id: number;
  name: string;
  colour: string;
  description?: string;
}

export const API_URL = "http://localhost:3000/labels";

export function useGetLabels() {
  return useQuery({
    queryKey: ["labels"],
    queryFn: () => axios.get(API_URL).then((res) => res.data as Label[]),
  });
}

export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (label: Label) =>
      axios.put(`${API_URL}/${label.id}`, label).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labelId: number) =>
      axios.delete(`${API_URL}/${labelId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

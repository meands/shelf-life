import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../App";
import { Label } from "@prisma/client";
export function useGetLabels() {
  return useQuery({
    queryKey: ["labels"],
    queryFn: () =>
      axiosInstance.get("/labels").then((res) => res.data as Label[]),
  });
}

export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (label: Omit<Label, "id">) =>
      axiosInstance.post("/labels", label).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (label: Label) =>
      axiosInstance.put(`/labels/${label.id}`, label).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labelId: number) =>
      axiosInstance.delete(`/labels/${labelId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

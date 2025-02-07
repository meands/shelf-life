import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../App";
import { CreateLabelRequest, UpdateLabelRequest } from "@shared/types";
import { Label } from "@prisma/client";

export function useGetLabels() {
  return useQuery<Label[]>({
    queryKey: ["labels"],
    queryFn: () =>
      axiosInstance.get("/labels").then((res) =>
        // label is jsonified, parsing it to Label object here
        res.data.map((label) => ({
          ...label,
          createdAt: new Date(label.createdAt),
          updatedAt: new Date(label.updatedAt),
        }))
      ),
  });
}

export function useCreateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createLabel"],
    mutationFn: async (label: CreateLabelRequest) =>
      axiosInstance.post("/labels", label).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels"] });
    },
  });
}

export function useUpdateLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateLabel"],
    mutationFn: async (label: UpdateLabelRequest) =>
      axiosInstance.put(`/labels/${label.id}`, label).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["labels"],
      });
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

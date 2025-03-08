import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../App";
import { CreateLabelRequest, UpdateLabelRequest } from "@shared/types";
import { Label } from "@prisma/client";

export function useGetLabels() {
  return useQuery<Label[]>({
    queryKey: ["labels"],
    queryFn: () =>
      axiosInstance.get("/labels").then((res) =>
        // @ts-expect-error
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
      queryClient.invalidateQueries();
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
      queryClient.invalidateQueries();
    },
  });
}

export function useDeleteLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labelId: number) =>
      axiosInstance.delete(`/labels/${labelId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useGetLabel(labelId: number) {
  return useQuery({
    queryKey: ["label", labelId],
    queryFn: () =>
      axiosInstance.get(`/labels/${labelId}`).then((res) => {
        const label = res.data;
        return {
          ...label,
          createdAt: new Date(label.createdAt),
          updatedAt: new Date(label.updatedAt),
          items: label.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            updatedAt: new Date(item.updatedAt),
            expiryDate: new Date(item.expiryDate),
          })),
        };
      }),
    enabled: !!labelId,
  });
}

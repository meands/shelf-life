import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../App";
import {
  CreateReminderRequest,
  UpdateReminderRequest,
} from "@expiry-tracker/shared/types";
import { Reminder } from "@prisma/client";
import { ReminderWithItem } from "@expiry-tracker/shared/types";

export function useReminders() {
  return useQuery<ReminderWithItem[]>({
    queryKey: ["reminders"],
    queryFn: () => axiosInstance.get("/reminders").then((res) => res.data),
  });
}

export function useDefaultReminder() {
  return useQuery<Reminder>({
    queryKey: ["defaultReminder"],
    queryFn: () =>
      axiosInstance.get("/reminders/default").then((res) => res.data),
  });
}

export function useItemReminder(itemId?: number) {
  return useQuery<Reminder | undefined>({
    queryKey: ["reminders", itemId],
    queryFn: () =>
      itemId
        ? axiosInstance.get(`/reminders/item/${itemId}`).then((res) => res.data)
        : undefined,
  });
}

export function useUpsertReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminder: CreateReminderRequest | UpdateReminderRequest) =>
      axiosInstance.put("/reminders", reminder).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(`/reminders/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
}

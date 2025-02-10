import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../App";
import { CreateReminderRequest, UpdateReminderRequest } from "@shared/types";
import { Reminder } from "@prisma/client";
import { ReminderWithItem } from "@types";

export function useReminders() {
  return useQuery<ReminderWithItem[]>({
    queryKey: ["reminders"],
    queryFn: () => axiosInstance.get("/reminders").then((res) => res.data),
  });
}

export function useItemReminder(itemId: number) {
  return useQuery<Reminder>({
    queryKey: ["reminders", itemId],
    queryFn: () =>
      axiosInstance.get(`/reminders/item/${itemId}`).then((res) => res.data),
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminder: CreateReminderRequest) =>
      axiosInstance.post("/reminders", reminder).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reminder: UpdateReminderRequest) =>
      axiosInstance
        .put(`/reminders/${reminder.id}`, reminder)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

export function useDeleteReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(`/reminders/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}

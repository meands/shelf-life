import { Button, Group, NumberInput, Stack, Switch } from "@mantine/core";
import { useUpsertReminder, useDefaultReminder } from "@api/reminder";
import { useState } from "react";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { UseMutateFunction } from "@tanstack/react-query";
import { Reminder } from "@prisma/client";
import {
  CreateReminderRequest,
  UpdateReminderRequest,
} from "@expiry-tracker/shared/types";

export function ReminderSettings({
  itemId,
  reminder,
}: {
  itemId?: number;
  reminder?: Reminder;
}) {
  const { data: defaultReminder, isLoading: isLoadingDefaultReminder } =
    useDefaultReminder();
  const { mutate: upsertReminder } = useUpsertReminder();

  if (isLoadingDefaultReminder) return <div>Loading...</div>;
  return (
    <ReminderSettingsPresentation
      itemId={itemId}
      reminder={reminder}
      defaultReminder={defaultReminder}
      upsertReminder={upsertReminder}
    />
  );
}

function ReminderSettingsPresentation({
  itemId,
  reminder,
  defaultReminder,
  upsertReminder,
}: {
  itemId?: number;
  reminder?: Reminder;
  defaultReminder?: Reminder;
  upsertReminder: UseMutateFunction<
    Reminder,
    Error,
    CreateReminderRequest | UpdateReminderRequest,
    unknown
  >;
}) {
  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState(
    reminder?.daysBeforeExpiry ?? defaultReminder?.daysBeforeExpiry ?? -1 // -1 indicates error - should not happen since there will always be a default reminder
  );
  const [isEnabled, setIsEnabled] = useState(reminder?.isEnabled ?? true);

  const handleSave = () => {
    upsertReminder(
      {
        daysBeforeExpiry,
        isEnabled,
        itemId,
        ...(reminder && { id: reminder.id }),
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Reminder updated",
            message: `Reminder ${reminder ? "updated" : "created"}`,
            color: "green",
          });
          modals.closeAll();
        },
        onError: (error) => {
          showNotification({
            title: "Error",
            message: error.message,
            color: "red",
          });
        },
      }
    );
  };

  return (
    <ReminderForm
      daysBeforeExpiry={daysBeforeExpiry}
      setDaysBeforeExpiry={setDaysBeforeExpiry}
      isEnabled={isEnabled}
      setIsEnabled={setIsEnabled}
      onSave={handleSave}
    />
  );
}

function ReminderForm({
  daysBeforeExpiry,
  setDaysBeforeExpiry,
  isEnabled,
  setIsEnabled,
  onSave,
}: {
  daysBeforeExpiry: number;
  setDaysBeforeExpiry: (value: number) => void;
  isEnabled: boolean;
  setIsEnabled: (value: boolean) => void;
  onSave: () => void;
}) {
  return (
    <Stack>
      <Group>
        <Switch
          label="Enable reminder"
          checked={isEnabled}
          onChange={(event) => setIsEnabled(event.currentTarget.checked)}
        />
      </Group>

      <NumberInput
        label="Days before expiry"
        description="You'll receive an email reminder this many days before the expiry date"
        value={daysBeforeExpiry}
        onChange={(value) => setDaysBeforeExpiry(value as number)}
        min={1}
        max={90}
        disabled={!isEnabled}
      />

      <Button onClick={onSave}>Save Settings</Button>
    </Stack>
  );
}

import { Button, Group, NumberInput, Stack, Switch } from "@mantine/core";
import {
  useCreateReminder,
  useItemReminder,
  useUpdateReminder,
} from "@api/reminder";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

const defaultDays = 7;

export function CreateReminderSettings({ itemId }: { itemId?: number }) {
  const { mutate: createReminder } = useCreateReminder();
  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState(defaultDays);
  const [isEnabled, setIsEnabled] = useState(true);

  const handleSave = () => {
    createReminder(
      { daysBeforeExpiry, isEnabled, itemId },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Reminder created",
            color: "green",
          });
          modals.closeAll();
        },
        onError: (error) => {
          notifications.show({
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

export function UpdateReminderSettings({ itemId }: { itemId: number }) {
  const { data: reminder } = useItemReminder(itemId);
  const { mutate: updateReminder } = useUpdateReminder();

  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState(
    reminder?.daysBeforeExpiry ?? defaultDays
  );
  const [isEnabled, setIsEnabled] = useState(reminder?.isEnabled ?? true);

  const handleSave = () => {
    if (!reminder) return;

    updateReminder(
      { daysBeforeExpiry, isEnabled, itemId, id: reminder.id },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Reminder updated",
            color: "green",
          });
          modals.closeAll();
        },
        onError: (error) => {
          notifications.show({
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

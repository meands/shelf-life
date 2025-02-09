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

export function ReminderSettings({ itemId }: { itemId: number }) {
  const { data: reminder } = useItemReminder(itemId);
  const { mutate: createReminder } = useCreateReminder();
  const { mutate: updateReminder } = useUpdateReminder();

  const initialDays = reminder?.daysBeforeExpiry ?? defaultDays;

  const [daysBeforeExpiry, setDaysBeforeExpiry] = useState<number>(initialDays);
  const [isEnabled, setIsEnabled] = useState(reminder?.isEnabled ?? true);

  const handleSave = () => {
    if (reminder) {
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
    } else {
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
    }
  };

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
      <Button onClick={handleSave}>Save Settings</Button>
    </Stack>
  );
}

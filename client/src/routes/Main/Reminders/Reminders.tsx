import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconEdit, IconTrash, IconPinnedFilled } from "@tabler/icons-react";
import {
  useReminders,
  useDeleteReminder,
  useDefaultReminder,
} from "@api/reminder";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { ReminderSettings } from "@components/ReminderSettings/ReminderSettings";

export function Reminders() {
  const { data: defaultReminder } = useDefaultReminder();
  const { data: reminders, isLoading } = useReminders();
  const { mutate: deleteReminder } = useDeleteReminder();

  const handleDelete = (id: number) => {
    deleteReminder(id, {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: "Reminder deleted successfully",
          color: "green",
        });
      },
      onError: (error) => {
        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
      },
    });
  };

  const openEditModal = (itemId: number) => {
    modals.open({
      title: "Edit Reminder",
      children: <ReminderSettings itemId={itemId} />,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <Stack>
      <Title order={2}>Reminders</Title>

      {defaultReminder && (
        <Card
          withBorder
          shadow="sm"
          p="md"
          radius="md"
          bg={defaultReminder.isEnabled ? "gray.0" : "gray.1"}
          opacity={defaultReminder.isEnabled ? 1 : 0.7}
          style={{
            borderColor: "var(--mantine-color-gray-3)",
          }}
        >
          <Stack>
            <Group justify="space-between">
              <Group gap="xs">
                <IconPinnedFilled
                  size={16}
                  style={{ color: "var(--mantine-color-blue-6)" }}
                />
                <div>
                  <Text fw={600}>Default</Text>
                  <Text size="sm">
                    Applies to all items without specific reminders
                  </Text>
                </div>
              </Group>

              <Button
                variant="subtle"
                onClick={() =>
                  modals.open({
                    title: "Edit Reminder",
                    children: <ReminderSettings reminder={defaultReminder} />,
                  })
                }
                p={8}
              >
                <IconEdit size={20} />
              </Button>
            </Group>

            <Text>
              Reminder: {defaultReminder.daysBeforeExpiry} days before expiry
            </Text>
          </Stack>
        </Card>
      )}

      {reminders?.map((reminder) => (
        <Card
          key={reminder.id}
          withBorder
          shadow="sm"
          p="md"
          radius="md"
          bg={reminder.isEnabled ? undefined : "gray.1"}
          style={{ opacity: reminder.isEnabled ? 1 : 0.7 }}
        >
          <Stack>
            <Group justify="space-between">
              <Text fw={500}>{reminder.item?.name}</Text>

              <Group>
                <Button
                  variant="subtle"
                  onClick={() => openEditModal(reminder.itemId!)}
                  p={8}
                >
                  <IconEdit size={20} />
                </Button>

                <Button
                  variant="subtle"
                  color="red"
                  onClick={() => handleDelete(reminder.id)}
                  p={8}
                >
                  <IconTrash size={20} />
                </Button>
              </Group>
            </Group>

            <Text>
              Reminder: {reminder.daysBeforeExpiry} days before expiry
            </Text>
          </Stack>
        </Card>
      ))}

      {reminders?.length === 0 && (
        <Text c="dimmed" ta="center">
          No reminders set. All items will be reminded{" "}
          {defaultReminder?.daysBeforeExpiry} days before expiry.
        </Text>
      )}
    </Stack>
  );
}

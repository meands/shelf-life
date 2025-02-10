import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useReminders, useDeleteReminder } from "@api/reminder";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import {
  CreateReminderSettings,
  UpdateReminderSettings,
} from "@components/ReminderSettings/ReminderSettings";

export function Reminders() {
  const { data: reminders, isLoading } = useReminders();
  const { mutate: deleteReminder } = useDeleteReminder();

  const defaultReminder = reminders?.find((r) => !r.itemId);

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
      children: <UpdateReminderSettings itemId={itemId} />,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Reminders</Title>

        <Button
          onClick={() =>
            modals.open({
              title: "Default Reminder Settings",
              children: <CreateReminderSettings />,
            })
          }
        >
          Set Default Reminder
        </Button>
      </Group>

      {defaultReminder && (
        <Card
          withBorder
          shadow="sm"
          p="md"
          radius="md"
          bg="gray.0"
          style={{ borderColor: "var(--mantine-color-gray-3)" }}
        >
          <Stack>
            <Group justify="space-between">
              <div>
                <Text fw={600}>Default Reminder</Text>
                <Text size="sm">
                  Applies to all items without specific reminders
                </Text>
              </div>

              <Group>
                <Button
                  variant="light"
                  onClick={() => openEditModal(defaultReminder.id)}
                >
                  Edit
                </Button>

                <Button
                  variant="light"
                  color="red"
                  onClick={() => handleDelete(defaultReminder.id)}
                >
                  Delete
                </Button>
              </Group>
            </Group>

            <Text>
              Reminder: {defaultReminder.daysBeforeExpiry} days before expiry
            </Text>

            <Text c={defaultReminder.isEnabled ? "green.6" : "red.6"} fw={500}>
              Status: {defaultReminder.isEnabled ? "Enabled" : "Disabled"}
            </Text>
          </Stack>
        </Card>
      )}

      {reminders
        ?.filter((r) => r.itemId)
        .map((reminder) => (
          <Card key={reminder.id} withBorder shadow="sm" p="md" radius="md">
            <Stack>
              <Group justify="space-between">
                <Text fw={500}>{reminder.item?.name}</Text>

                <Group>
                  <Button
                    variant="light"
                    onClick={() => openEditModal(reminder.itemId!)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(reminder.id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Group>

              <Text>
                Reminder: {reminder.daysBeforeExpiry} days before expiry
              </Text>
              <Text c={reminder.isEnabled ? "green.6" : "red.6"} fw={500}>
                Status: {reminder.isEnabled ? "Enabled" : "Disabled"}
              </Text>
            </Stack>
          </Card>
        ))}

      {reminders?.length === 0 && (
        <Text c="dimmed" ta="center">
          No reminders set. Create a default reminder or set reminders for
          specific items.
        </Text>
      )}
    </Stack>
  );
}

import {
  Badge,
  Burger,
  Button,
  Container,
  Group,
  Menu,
  NumberInput,
  Paper,
  Switch,
  Table,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconBell,
  IconBellOff,
  IconEdit,
  IconTrash,
  IconPlus,
  IconBarcode,
  IconChefHat,
} from "@tabler/icons-react";
import { useDeleteItem, useItems, useUpdateItem } from "@api/item";
import { useDebouncedCallback } from "@mantine/hooks";
import { useState } from "react";
import { EnrichedItem } from "@expiry-tracker/shared/types";
import { Label } from "@prisma/client";
import { UpdateItemModal } from "../../../modals/UpdateItem";
import { CreateItemModal } from "../../../modals/CreateItem";
import { notifications } from "@mantine/notifications";
import { useDefaultReminder, useUpsertReminder } from "@api/reminder";
import { Reminder } from "@prisma/client";
import { ReminderSettings } from "@components/ReminderSettings/ReminderSettings";
import { ScanBarcodeForProduct } from "../../../modals/ScanBarcode";
import { GenerateRecipes } from "../../../modals/GenerateRecipes";

export function Items() {
  const { data: items, isLoading, error } = useItems();
  const {
    data: defaultReminder,
    isLoading: isDefaultReminderLoading,
    error: defaultReminderError,
  } = useDefaultReminder();

  if (isLoading || isDefaultReminderLoading)
    return <Container size="xl">Loading...</Container>;

  if (error || defaultReminderError)
    return (
      <Container size="xl">
        Error: {error?.message || defaultReminderError?.message}
      </Container>
    );

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Expiry Date</Table.Th>
              <Table.Th>Expiry Type</Table.Th>
              <Table.Th w={"var(--mantine-spacing-xl)"}>Quantity</Table.Th>
              <Table.Th>Unit</Table.Th>
              <Table.Th>Labels</Table.Th>
              <Table.Th>Reminder</Table.Th>
              <Table.Th>Notes</Table.Th>
              <Table.Th w={"var(--mantine-spacing-xl)"}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {items?.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                defaultReminder={defaultReminder}
              />
            ))}
          </Table.Tbody>
        </Table>

        <Container
          pos="fixed"
          bottom="var(--mantine-spacing-md)"
          right="var(--mantine-spacing-md)"
        >
          <AddItemBtn />
          <ScanBarcodeBtn />
          <GenerateRecipeBtn />
        </Container>
      </Paper>
    </Container>
  );
}

function ItemRow({
  item,
  defaultReminder,
}: {
  item: EnrichedItem;
  defaultReminder?: Reminder;
}) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { mutate: updateItem } = useUpdateItem();
  const { mutate: upsertReminder } = useUpsertReminder();

  const reminderEnabled =
    (item.reminders?.[0]?.isEnabled ||
      (defaultReminder?.isEnabled && !item.reminders?.[0])) ??
    false;

  const handleQuantityChange = useDebouncedCallback((value: number) => {
    updateItem(
      {
        ...item,
        quantity: value,
        expiryDate: new Date(item.expiryDate),
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Item updated successfully",
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
      }
    );
  }, 1000);

  const handleReminderToggle = (reminder?: Reminder) => {
    upsertReminder(
      reminder
        ? {
            ...reminder,
            isEnabled: !reminderEnabled,
            itemId: item.id,
          }
        : {
            isEnabled: !reminderEnabled,
            itemId: item.id,
            daysBeforeExpiry: defaultReminder?.daysBeforeExpiry ?? -1, // -1 indicates err
          },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Reminder updated successfully",
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
      }
    );
  };

  return (
    <Table.Tr>
      <Table.Td fw={500}>{item.name}</Table.Td>
      <Table.Td>
        <Badge color={new Date() < new Date(item.expiryDate) ? "green" : "red"}>
          {new Date() < new Date(item.expiryDate) ? "In Date" : "Expired"}
        </Badge>
      </Table.Td>
      <Table.Td>{item.expiryDate.toLocaleDateString()}</Table.Td>
      <Table.Td>{item.expiryType}</Table.Td>
      <Table.Td>
        <NumberInput
          value={quantity}
          onChange={(value) => {
            setQuantity(value as number);
            handleQuantityChange(value as number);
          }}
          min={0}
          size="xs"
        />
      </Table.Td>
      <Table.Td>{item.unit}</Table.Td>
      <Table.Td>
        <Group gap="xs">
          {item.labels.map((label) => (
            <LabelSwatch key={label.id} label={label} />
          ))}
        </Group>
      </Table.Td>
      <Table.Td>
        <Group>
          <Switch
            checked={reminderEnabled}
            onChange={() => handleReminderToggle(item.reminders?.[0])}
            thumbIcon={
              reminderEnabled ? (
                <IconBell size="0.8rem" stroke={3} />
              ) : (
                <IconBellOff size="0.8rem" stroke={3} />
              )
            }
          />

          {item.reminders?.[0]?.isEnabled ? (
            <Text size="sm" c="dimmed">
              {item.reminders?.[0].daysBeforeExpiry} days before
            </Text>
          ) : defaultReminder?.isEnabled && !item.reminders?.[0] ? (
            <Text size="sm" c="dimmed">
              Default: {defaultReminder?.daysBeforeExpiry} days before
            </Text>
          ) : (
            <Text size="sm" c="dimmed">
              No reminder
            </Text>
          )}
        </Group>
      </Table.Td>
      <Table.Td>{item.notes.map((note) => note.note).join(", ")}</Table.Td>
      <Table.Td>
        <ItemActions item={item} />
      </Table.Td>
    </Table.Tr>
  );
}

function ItemActions({ item }: { item: EnrichedItem }) {
  const { mutate: deleteItem } = useDeleteItem();

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Burger size="sm" />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEdit size={14} />}
          onClick={() =>
            modals.open({ children: <UpdateItemModal itemId={item.id} /> })
          }
        >
          Edit Item
        </Menu.Item>

        <Menu.Item
          leftSection={<IconBell size={14} />}
          onClick={() =>
            modals.open({
              children: (
                <ReminderSettings
                  itemId={item.id}
                  reminder={item.reminders?.[0]}
                />
              ),
            })
          }
        >
          Edit Reminder
        </Menu.Item>

        <Menu.Item
          leftSection={<IconTrash size={14} />}
          onClick={() => deleteItem(item.id)}
          color="red"
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

function LabelSwatch({ label }: { label: Label }) {
  return <Badge color={label.colour}>{label.name}</Badge>;
}

function AddItemBtn() {
  return (
    <Button
      size="md"
      variant="subtle"
      onClick={() => modals.open({ children: <CreateItemModal /> })}
    >
      <IconPlus size={20} />
    </Button>
  );
}

function ScanBarcodeBtn() {
  return (
    <Button
      size="md"
      variant="subtle"
      onClick={() => modals.open({ children: <ScanBarcodeForProduct /> })}
    >
      <IconBarcode size={20} />
    </Button>
  );
}

function GenerateRecipeBtn() {
  return (
    <Button
      size="md"
      variant="subtle"
      onClick={() => modals.open({ children: <GenerateRecipes /> })}
    >
      <IconChefHat size={20} />
    </Button>
  );
}

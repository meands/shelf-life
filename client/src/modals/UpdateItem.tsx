import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useItem, useUpdateItem } from "@api/item";
import { NoteFields } from "@components/NoteFields/NoteFields";
import { EnrichedItem, UpdateItemRequest } from "@types";
import { modals } from "@mantine/modals";
import { UseMutateFunction } from "@tanstack/react-query";

export function UpdateItemModal({ itemId }: { itemId: number }) {
  const { data: item, isLoading } = useItem(itemId);
  const { mutate: updateItem } = useUpdateItem();

  if (isLoading) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;
  return <UpdateItemForm item={item} updateItem={updateItem} />;
}

function UpdateItemForm({
  item,
  updateItem,
}: {
  item: EnrichedItem;
  updateItem: UseMutateFunction<EnrichedItem, Error, UpdateItemRequest>;
}) {
  const form = useForm({
    initialValues: {
      ...item,
      expiryDate: item.expiryDate.toISOString().split("T")[0],
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    updateItem(
      {
        ...values,
        expiryDate: new Date(values.expiryDate),
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Item updated successfully",
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
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Name"
          placeholder="Enter item name"
          withAsterisk
          {...form.getInputProps("name")}
        />
        <Group grow>
          <NumberInput
            label="Quantity"
            placeholder="Enter quantity"
            withAsterisk
            {...form.getInputProps("quantity")}
          />
          <TextInput
            label="Unit"
            placeholder="Enter unit"
            withAsterisk
            {...form.getInputProps("unit")}
          />
        </Group>
        <TextInput
          label="Expiry Date"
          type="date"
          withAsterisk
          {...form.getInputProps("expiryDate")}
        />
        <Select
          label="Expiry Type"
          data={["Best before", "Use by"]}
          {...form.getInputProps("expiryType")}
        />

        <NoteFields
          notes={form.values.notes}
          addNote={(note) => form.insertListItem("notes", note)}
          removeNote={(idx) => form.removeListItem("notes", idx)}
          getInputProps={form.getInputProps}
        />

        <Button type="submit" mt="md">
          Update Item
        </Button>
      </Stack>
    </form>
  );
}

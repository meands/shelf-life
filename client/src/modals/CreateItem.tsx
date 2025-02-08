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
import { useCreateItem } from "@api/item";
import { ContextModalProps } from "@mantine/modals";
import { NoteFields } from "@components/NoteFields/NoteFields";

export function CreateItemModal({ context, id }: ContextModalProps) {
  const { mutate: createItem, isPending } = useCreateItem();

  const form = useForm({
    initialValues: {
      name: "",
      quantity: 1,
      unit: "",
      expiryDate: "",
      expiryType: "Best before",
      labels: [],
      notes: [{ note: "" }],
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    createItem(
      {
        ...values,
        expiryDate: new Date(values.expiryDate),
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Item created successfully",
            color: "green",
          });
          context.closeModal(id);
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

        <Button type="submit" loading={isPending} mt="md">
          Create Item
        </Button>
      </Stack>
    </form>
  );
}

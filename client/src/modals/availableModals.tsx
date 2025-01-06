import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { Item, useCreateItem, useUpdateItem } from "../api/item";

export const globalModals = {
  addItem: AddItem,
  editAmountRemaining: EditAmountRemaining,
  editItem: EditItem,
};

function AddItem({ context, id }: ContextModalProps) {
  const { mutate: addItem, isPending } = useCreateItem();

  const form = useForm({
    initialValues: {
      name: "",
      unit: "",
      expiryDate: "",
      expiryType: "",
      category: "",
      notes: "",
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        addItem({ ...values, notes: [values.notes] });
        context.closeModal(id);
      })}
    >
      <TextInput label="Name" {...form.getInputProps("name")} />
      <TextInput label="Unit" {...form.getInputProps("unit")} />
      <TextInput label="Expiry Date" {...form.getInputProps("expiryDate")} />
      <TextInput label="Expiry Type" {...form.getInputProps("expiryType")} />
      <TextInput label="Category" {...form.getInputProps("category")} />
      <TextInput label="Notes" {...form.getInputProps("notes")} />

      <Button type="submit" loading={isPending}>
        Submit
      </Button>
    </form>
  );
}

function EditAmountRemaining({
  context,
  id,
  innerProps,
}: ContextModalProps<{ item: Item }>) {
  const { mutate: updateItem, isPending } = useUpdateItem();

  const form = useForm({
    initialValues: {
      amount: "",
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updateItem({ ...innerProps.item, unit: values.amount });
        context.closeModal(id);
      })}
    >
      <TextInput label="Amount Remaining" {...form.getInputProps("amount")} />
      <Button type="submit" loading={isPending}>
        Submit
      </Button>
    </form>
  );
}

function EditItem({
  context,
  id,
  innerProps,
}: ContextModalProps<{ item: Item }>) {
  const { mutate: updateItem, isPending } = useUpdateItem();

  const form = useForm({
    initialValues: innerProps.item,
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updateItem(values);
        context.closeModal(id);
      })}
    >
      <TextInput label="Name" {...form.getInputProps("name")} />
      <TextInput label="Unit" {...form.getInputProps("unit")} />
      <TextInput label="Expiry Date" {...form.getInputProps("expiryDate")} />
      <TextInput label="Expiry Type" {...form.getInputProps("expiryType")} />
      <TextInput label="Category" {...form.getInputProps("category")} />
      <TextInput label="Notes" {...form.getInputProps("notes")} />
      <Button type="submit" loading={isPending}>
        Submit
      </Button>
    </form>
  );
}

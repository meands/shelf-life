import { Button, Select, TagsInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { Item, useCreateItem, useUpdateItem } from "../api/item";
import { Label, useGetLabels, useUpdateLabel } from "../api/label";

export const globalModals = {
  addItem: AddItem,
  editAmountRemaining: EditAmountRemaining,
  editItem: EditItem,
  editLabel: EditLabel,
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
      labels: "",
      notes: "",
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        // TODO: impl like edit item
        addItem({
          ...values,
          notes: [values.notes],
          labels: [],
        });
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
  const { data: labels, isLoading: isLoadingLabels } = useGetLabels();

  const form = useForm({
    initialValues: {
      name: innerProps.item.name,
      unit: innerProps.item.unit,
      expiryDate: innerProps.item.expiryDate,
      expiryType: innerProps.item.expiryType,
      labels: innerProps.item.labels,
      notes: innerProps.item.notes,
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updateItem({
          ...innerProps.item,
          ...values,
        });
        context.closeModal(id);
      })}
    >
      <TextInput label="Name" {...form.getInputProps("name")} />
      <TextInput label="Unit" {...form.getInputProps("unit")} />
      <TextInput label="Expiry Date" {...form.getInputProps("expiryDate")} />
      <Select
        label="Expiry Type"
        placeholder="Pick value"
        data={["best before", "use by"]}
        {...form.getInputProps("expiryType")}
      />
      {isLoadingLabels ? (
        <></>
      ) : (
        <TagsInput
          label="Labels"
          placeholder="Tag this item"
          data={labels?.map((label) => label.name)}
          acceptValueOnBlur={false}
          mt="md"
          value={form.values.labels.map((label) => label.name)}
          onChange={(values) => {
            // TODO: groupBy compatibility
            // @ts-ignore
            const { existing, newLabels } = Object.groupBy(
              values,
              (label: string) =>
                form.values.labels.find((e) => e.name === label)
                  ? "existing"
                  : "newLabels"
            );
            form.setFieldValue("labels", [
              ...(form.values.labels?.filter((label) =>
                existing.includes(label.name)
              ) || []),
              ...(newLabels?.map((label: string) => ({
                id: 0,
                name: label,
                colour: "#" + Math.floor(Math.random() * 16777215).toString(16),
              })) || []),
            ]);
          }}
        />
      )}
      <TextInput label="Notes" {...form.getInputProps("notes")} />
      <Button type="submit" loading={isPending}>
        Submit
      </Button>
    </form>
  );
}

function EditLabel({
  context,
  id,
  innerProps,
}: ContextModalProps<{ label: Label }>) {
  const { mutate: updateLabel, isPending } = useUpdateLabel();

  const form = useForm({
    initialValues: {
      name: innerProps.label.name,
      colour: innerProps.label.colour,
      description: innerProps.label.description,
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        updateLabel({ ...innerProps.label, ...values });
        context.closeModal(id);
      })}
    >
      <TextInput label="Name" {...form.getInputProps("name")} />
      <TextInput label="Colour" {...form.getInputProps("colour")} />
      <TextInput label="Description" {...form.getInputProps("description")} />
      <Button type="submit" loading={isPending}>
        Submit
      </Button>
    </form>
  );
}

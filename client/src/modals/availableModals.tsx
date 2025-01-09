import {
  Button,
  ColorInput,
  Group,
  NumberInput,
  Select,
  TagsInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ContextModalProps } from "@mantine/modals";
import { Item, useCreateItem, useUpdateItem } from "../api/item";
import {
  Label,
  useCreateLabel,
  useGetLabels,
  useUpdateLabel,
} from "../api/label";

export const globalModals = {
  addItem: AddItem,
  editItem: EditItem,
  addLabel: AddLabel,
  editLabel: EditLabel,
};

function AddItem({ context, id }: ContextModalProps) {
  const { mutate: addItem, isPending } = useCreateItem();
  const { data: labels, isLoading: isLoadingLabels } = useGetLabels();

  const form = useForm({
    initialValues: {
      name: "",
      unit: "",
      quantity: 1,
      expiryDate: "",
      expiryType: "Best before",
      labels: [] as Label[],
      notes: [] as string[],
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        addItem(values);
        context.closeModal(id);
      })}
    >
      <TextInput label="Name" {...form.getInputProps("name")} />
      <Group justify="left">
        <NumberInput label="Quantity" {...form.getInputProps("quantity")} />
        <TextInput label="Unit" {...form.getInputProps("unit")} />
      </Group>
      <TextInput label="Expiry Date" {...form.getInputProps("expiryDate")} />
      <Select
        label="Expiry Type"
        placeholder="Pick value"
        data={["Best before", "Use by"]}
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
            form.setFieldValue("labels", getLabels(form.values.labels, values));
          }}
        />
      )}

      <TextInput
        label="Notes"
        value={form.values.notes.join(", ")}
        onChange={(e) =>
          form.setFieldValue("notes", e.target.value.split(", "))
        }
      />
      <Button type="submit" loading={isPending} mt="md">
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
      quantity: innerProps.item.quantity,
      unit: innerProps.item.unit,
      expiryDate: innerProps.item.expiryDate,
      expiryType: innerProps.item.expiryType,
      labels: innerProps.item.labels,
      notes: innerProps.item.notes.map((note) => note.note),
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
      <Group justify="left">
        <NumberInput label="Quantity" {...form.getInputProps("quantity")} />
        <TextInput label="Unit" {...form.getInputProps("unit")} />
      </Group>
      <TextInput label="Expiry Date" {...form.getInputProps("expiryDate")} />
      <Select
        label="Expiry Type"
        placeholder="Pick value"
        data={["Best before", "Use by"]}
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
            form.setFieldValue("labels", getLabels(form.values.labels, values));
          }}
        />
      )}
      <TextInput
        label="Notes"
        value={form.values.notes.join(", ")}
        onChange={(e) =>
          form.setFieldValue("notes", e.target.value.split(", "))
        }
      />

      <Button type="submit" loading={isPending} mt="md">
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

      <ColorInput
        label="Colour"
        value={form.values.colour}
        onChange={(value) => form.setFieldValue("colour", value)}
      />

      <TextInput label="Description" {...form.getInputProps("description")} />

      <Button type="submit" loading={isPending} mt="md">
        Submit
      </Button>
    </form>
  );
}

function getLabels(
  previousLabelItems: Label[],
  currentLabels: string[]
): Label[] {
  const existingLabelItems = previousLabelItems.filter((label) =>
    currentLabels.includes(label.name)
  );

  const newLabelItems = currentLabels
    .filter(
      (label) =>
        !existingLabelItems.find(
          (existingLabel) => existingLabel.name === label
        )
    )
    .map((label) => ({
      id: 0,
      name: label,
      colour: "#" + Math.floor(Math.random() * 16777215).toString(16),
    }));

  return [...existingLabelItems, ...newLabelItems];
}

function AddLabel({ context, id }: ContextModalProps) {
  const { mutate: addLabel, isPending } = useCreateLabel();

  const form = useForm({
    initialValues: {
      name: "",
      colour: "",
      description: "",
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        addLabel(values);
        context.closeModal(id);
      })}
    >
      <TextInput label="Name" {...form.getInputProps("name")} />

      <ColorInput
        label="Colour"
        value={form.values.colour}
        onChange={(value) => form.setFieldValue("colour", value)}
      />

      <TextInput label="Description" {...form.getInputProps("description")} />

      <Button type="submit" loading={isPending} mt="md">
        Submit
      </Button>
    </form>
  );
}

import {
  Button,
  ColorInput,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCreateItem, useUpdateItem } from "@api/item";
import { useCreateLabel, useUpdateLabel } from "@api/label";
import { Label, Note } from "@shared/types";
import { NoteFields } from "@components/NoteFields/NoteFields";

interface CreateItemModalProps {
  onClose: () => void;
}

interface UpdateItemModalProps {
  onClose: () => void;
  innerProps: {
    item: {
      id: number;
      name: string;
      quantity: number;
      unit: string;
      expiryDate: string;
      expiryType: string;
      labels: Label[];
      notes: Note[];
    };
  };
}

interface CreateLabelModalProps {
  onClose: () => void;
}

interface UpdateLabelModalProps {
  onClose: () => void;
  innerProps: {
    label: Label;
  };
}

export const globalModals = {
  createItem: ({ onClose }: CreateItemModalProps) => {
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
      createItem(values, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Item created successfully",
            color: "green",
          });
          onClose();
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message: error.message,
            color: "red",
          });
        },
      });
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
          <NoteFields form={form} />
          <Button type="submit" loading={isPending} mt="md">
            Create Item
          </Button>
        </Stack>
      </form>
    );
  },

  updateItem: ({ onClose, innerProps }: UpdateItemModalProps) => {
    const { mutate: updateItem, isPending } = useUpdateItem();

    const form = useForm({
      initialValues: {
        id: innerProps.item.id,
        name: innerProps.item.name,
        quantity: innerProps.item.quantity,
        unit: innerProps.item.unit,
        expiryDate: innerProps.item.expiryDate,
        expiryType: innerProps.item.expiryType,
        labels: innerProps.item.labels,
        notes: innerProps.item.notes.length
          ? innerProps.item.notes
          : [{ note: "" }],
      },
    });

    const handleSubmit = form.onSubmit((values) => {
      updateItem(values, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Item updated successfully",
            color: "green",
          });
          onClose();
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message: error.message,
            color: "red",
          });
        },
      });
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
          <NoteFields form={form} />
          <Button type="submit" loading={isPending} mt="md">
            Update Item
          </Button>
        </Stack>
      </form>
    );
  },

  createLabel: ({ onClose }: CreateLabelModalProps) => {
    const { mutate: createLabel, isPending } = useCreateLabel();

    const form = useForm({
      initialValues: {
        name: "",
        colour: "#000000",
        description: "",
      },
    });

    const handleSubmit = form.onSubmit((values) => {
      createLabel(values, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Label created successfully",
            color: "green",
          });
          onClose();
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message: error.message,
            color: "red",
          });
        },
      });
    });

    return (
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter label name"
            withAsterisk
            {...form.getInputProps("name")}
          />
          <ColorInput
            label="Colour"
            placeholder="Pick a colour"
            withAsterisk
            {...form.getInputProps("colour")}
          />
          <TextInput
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
          />
          <Button type="submit" loading={isPending} mt="md">
            Create Label
          </Button>
        </Stack>
      </form>
    );
  },

  updateLabel: ({ onClose, innerProps }: UpdateLabelModalProps) => {
    const { mutate: updateLabel, isPending } = useUpdateLabel();

    const form = useForm({
      initialValues: {
        id: innerProps.label.id,
        name: innerProps.label.name,
        colour: innerProps.label.colour,
        description: innerProps.label.description || "",
      },
    });

    const handleSubmit = form.onSubmit((values) => {
      updateLabel(values, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Label updated successfully",
            color: "green",
          });
          onClose();
        },
        onError: (error) => {
          notifications.show({
            title: "Error",
            message: error.message,
            color: "red",
          });
        },
      });
    });

    return (
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Name"
            placeholder="Enter label name"
            withAsterisk
            {...form.getInputProps("name")}
          />
          <ColorInput
            label="Colour"
            placeholder="Pick a colour"
            withAsterisk
            {...form.getInputProps("colour")}
          />
          <TextInput
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
          />
          <Button type="submit" loading={isPending} mt="md">
            Update Label
          </Button>
        </Stack>
      </form>
    );
  },
};

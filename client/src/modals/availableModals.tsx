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
import {
  CreateLabelRequest,
  Label,
  UpdateItemRequest,
  UpdateLabelRequest,
} from "@shared/types";
import { NoteFields } from "@components/NoteFields/NoteFields";
import { ContextModalProps } from "@mantine/modals";

export const globalModals = {
  createItem: ({ context, id }: ContextModalProps) => {
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
          <NoteFields form={form} />
          <Button type="submit" loading={isPending} mt="md">
            Create Item
          </Button>
        </Stack>
      </form>
    );
  },

  updateItem: ({
    context,
    id,
    innerProps,
  }: ContextModalProps<{ item: UpdateItemRequest }>) => {
    const { mutate: updateItem, isPending } = useUpdateItem();

    const form = useForm<UpdateItemRequest>({
      initialValues: innerProps.item,
    });

    const handleSubmit = form.onSubmit((values) => {
      updateItem(values, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: "Item updated successfully",
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

  createLabel: ({ context, id }: ContextModalProps) => {
    const { mutate: createLabel, isPending } = useCreateLabel();

    const form = useForm<CreateLabelRequest>({
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
          context.closeModal(id);
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

  updateLabel: ({
    context,
    id,
    innerProps,
  }: ContextModalProps<{ label: Label & { id: number } }>) => {
    const { mutate: updateLabel, isPending } = useUpdateLabel();

    const form = useForm<UpdateLabelRequest>({
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
          context.closeModal(id);
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

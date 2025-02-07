import { Button, ColorInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCreateLabel } from "@api/label";
import { CreateLabelRequest } from "@shared/types";
import { ContextModalProps } from "@mantine/modals";

export function CreateLabelModal({ context, id }: ContextModalProps) {
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
}

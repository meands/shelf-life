import { Button, ColorInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useUpdateLabel } from "@api/label";
import { UpdateLabelRequest } from "@expiry-tracker/shared/types";
import { Label } from "@prisma/client";
import { modals } from "@mantine/modals";

export function UpdateLabelModal({ label }: { label: Label }) {
  const { mutate: updateLabel, isPending } = useUpdateLabel();

  const form = useForm<UpdateLabelRequest>({
    initialValues: {
      id: label.id,
      name: label.name,
      colour: label.colour,
      description: label.description || "",
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
        modals.closeAll();
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
}

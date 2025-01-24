import { ActionIcon, Button, Group, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Note } from "@shared/types";

interface NoteFieldsProps {
  form: UseFormReturnType<any>;
  name?: string;
}

export function NoteFields({ form, name = "notes" }: NoteFieldsProps) {
  const fields = form.values[name].map((note: Note, index: number) => (
    <Group key={index} mt="xs">
      <TextInput
        placeholder="Add a note"
        style={{ flex: 1 }}
        {...form.getInputProps(`${name}.${index}.note`)}
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem(name, index)}
        disabled={form.values[name].length === 1}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  return (
    <Stack>
      {fields}
      <Group justify="center" mt="md">
        <Button
          size="xs"
          leftSection={<IconPlus size="1rem" />}
          onClick={() => form.insertListItem(name, { note: "" })}
        >
          Add Note
        </Button>
      </Group>
    </Stack>
  );
}

import { ActionIcon, Button, Group, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Note } from "@shared/types";

interface NoteFieldsProps {
  form: UseFormReturnType<{ notes: Note[] }>;
}

export function NoteFields({ form }: NoteFieldsProps) {
  const fields = form.values.notes.map((note: Note, index: number) => (
    <Group mt="xs">
      <TextInput
        placeholder="Add a note"
        style={{ flex: 1 }}
        {...form.getInputProps(`notes.${index}.note`)}
      />
      <ActionIcon
        color="red"
        onClick={() => form.removeListItem("notes", index)}
        disabled={form.values.notes.length === 1}
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
          variant="outline"
          size="xs"
          leftSection={<IconPlus size="1rem" />}
          onClick={() => form.insertListItem("notes", { note: "" })}
        >
          Note
        </Button>
      </Group>
    </Stack>
  );
}

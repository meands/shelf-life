import { ActionIcon, Button, Group, Stack, TextInput } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { NoteWithOptionalId } from "@shared/types";
import { GetInputProps } from "node_modules/@mantine/form/lib/types";

interface NoteFieldsProps {
  notes: NoteWithOptionalId[];
  addNote: (note: NoteWithOptionalId) => void;
  removeNote: (idx: number) => void;
  getInputProps: GetInputProps<{ notes: NoteWithOptionalId[] }>;
}

export function NoteFields({
  notes,
  getInputProps,
  addNote,
  removeNote,
}: NoteFieldsProps) {
  const fields = notes.map((_, index: number) => (
    <Group key={index} mt="xs">
      <TextInput
        placeholder="Add a note"
        style={{ flex: 1 }}
        {...getInputProps(`notes.${index}.note`)}
      />
      <ActionIcon color="red" onClick={() => removeNote(index)}>
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
          onClick={() => addNote({ note: "" })}
        >
          Note
        </Button>
      </Group>
    </Stack>
  );
}

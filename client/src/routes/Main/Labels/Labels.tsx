import { Burger, Button, Container, Menu, Paper, Table } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDeleteLabel, useGetLabels } from "@api/label";
import { Label } from "@prisma/client";
import { CreateLabelModal } from "../../../modals/CreateLabel";
import { UpdateLabelModal } from "../../../modals/UpdateLabel";
import { Link } from "react-router";

export function Labels() {
  const { data: labels, isLoading, error } = useGetLabels();

  if (isLoading) return <Container size="xl">Loading...</Container>;
  if (error) return <Container size="xl">Error: {error.message}</Container>;

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Colour</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {labels?.map((label) => (
              <Table.Tr key={label.id}>
                <Table.Td>
                  <Link to={`/labels/${label.id}`}>{label.name}</Link>
                </Table.Td>
                <Table.Td>
                  <Paper bg={label.colour} w={20} h={20} radius="sm" />
                </Table.Td>
                <Table.Td>{label.description}</Table.Td>
                <Table.Td>
                  <LabelActions label={label} />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <Container
        pos="fixed"
        bottom="var(--mantine-spacing-md)"
        right="var(--mantine-spacing-md)"
      >
        <Button
          size="md"
          onClick={() => modals.open({ children: <CreateLabelModal /> })}
        >
          + Label
        </Button>
      </Container>
    </Container>
  );
}

function LabelActions({ label }: { label: Label }) {
  const { mutate: deleteLabel } = useDeleteLabel();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Burger />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEdit size={14} />}
          onClick={() =>
            modals.open({
              children: <UpdateLabelModal label={label} />,
            })
          }
        >
          Edit
        </Menu.Item>

        <Menu.Item
          leftSection={<IconTrash size={14} />}
          onClick={() => deleteLabel(label.id)}
          color="red"
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

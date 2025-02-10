import { Burger, Button, Container, Menu, rem, Table } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useDeleteLabel, useGetLabels } from "@api/label";
import { Label } from "@prisma/client";
import { CreateLabelModal } from "../../../modals/CreateLabel";
import { UpdateLabelModal } from "../../../modals/UpdateLabel";

export function Labels() {
  const { data: labels, isLoading, error } = useGetLabels();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Colour</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        {labels?.map((label) => (
          <Table.Tr key={label.id}>
            <Table.Td>{label.name}</Table.Td>
            <Table.Td>
              <div
                style={{
                  backgroundColor: label.colour,
                  width: "20px",
                  height: "20px",
                  borderRadius: "4px",
                }}
              />
            </Table.Td>
            <Table.Td>{label.description}</Table.Td>
            <Table.Td>
              <LabelActions label={label} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table>

      <Button
        onClick={() => modals.open({ children: <CreateLabelModal /> })}
        mt="md"
      >
        Add Label
      </Button>
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
          leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
          onClick={() =>
            modals.open({
              children: <UpdateLabelModal label={label} />,
            })
          }
        >
          Edit
        </Menu.Item>

        <Menu.Item
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() => deleteLabel(label.id)}
          color="red"
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

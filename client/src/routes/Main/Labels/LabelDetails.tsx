import { Badge, Container, Paper, Table, Title } from "@mantine/core";
import { useGetLabel } from "@api/label";
import { Item } from "@prisma/client";
import { useParams } from "react-router";

export function LabelDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: label, isLoading, error } = useGetLabel(parseInt(id || "0"));

  if (isLoading) return <Container size="xl">Loading...</Container>;
  if (error) return <Container size="xl">Error: {error.message}</Container>;
  if (!label) return <Container size="xl">Label not found</Container>;

  return (
    <Container size="xl" py="xl">
      <Paper shadow="sm" p="md" radius="md" withBorder mb="xl">
        <Title order={2} mb="md">
          <Badge color={label.colour} size="xl">
            {label.name}
          </Badge>
        </Title>
        {label.description && <p>{label.description}</p>}
      </Paper>

      <Paper shadow="sm" p="md" radius="md" withBorder>
        <Title order={3} mb="md">
          Items with this Label
        </Title>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Unit</Table.Th>
              <Table.Th>Expiry Date</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {label.items.map((item: Item) => (
              <Table.Tr key={item.id}>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
                <Table.Td>{item.unit}</Table.Td>
                <Table.Td>{item.expiryDate.toLocaleDateString()}</Table.Td>
              </Table.Tr>
            ))}
            {label.items.length === 0 && (
              <Table.Tr>
                <Table.Td colSpan={4} align="center">
                  No items found with this label
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Container>
  );
}

import { Burger, Button, Container, Menu, rem, Table } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconCoins, IconEdit, IconTrash } from "@tabler/icons-react";
import { Item, useDeleteItem, useItems } from "../../../api/item";

export function Items() {
  const { data: items, isLoading, error } = useItems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Unit</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Expiry Date</Table.Th>
            <Table.Th>Expiry Type</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Notes</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        {items?.map((item) => {
          return (
            <Table.Tr>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>{item.unit}</Table.Td>
              <Table.Td>{item.category}</Table.Td>
              <Table.Td>{item.expiryDate}</Table.Td>
              <Table.Td>{item.expiryType}</Table.Td>
              <Table.Td>
                {new Date() < new Date(item.expiryDate) ? ":)" : ":("}
              </Table.Td>
              <Table.Td>{item.notes?.join(", ")}</Table.Td>
              <Table.Td>
                <ItemActions item={item} />
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table>

      <Container style={{ position: "fixed", bottom: 50, right: 50 }}>
        <AddItemBtn />
      </Container>
    </Container>
  );
}

function ItemActions({ item }: { item: Item }) {
  const { mutate: deleteItem } = useDeleteItem();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Burger />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconEdit style={{ width: rem(14), height: rem(14) }} />}
          onClick={() =>
            modals.openContextModal({
              modal: "editItem",
              innerProps: { item },
            })
          }
        >
          Edit
        </Menu.Item>
        <Menu.Item
          leftSection={
            <IconCoins style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() =>
            modals.openContextModal({
              modal: "editAmountRemaining",
              innerProps: { item },
            })
          }
        >
          Edit Amount
        </Menu.Item>

        <Menu.Item
          leftSection={
            <IconTrash style={{ width: rem(14), height: rem(14) }} />
          }
          onClick={() => deleteItem(item.id)}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export function AddItemBtn() {
  return (
    <Button
      onClick={() =>
        modals.openContextModal({
          modal: "addItem",
          innerProps: {},
        })
      }
    >
      + item
    </Button>
  );
}

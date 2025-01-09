import {
  Burger,
  Button,
  Container,
  Menu,
  NumberInput,
  rem,
  Table,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import {
  Item,
  useDeleteItem,
  useItems,
  useUpdateItem,
} from "../../../api/item";
import { useDebouncedCallback } from "@mantine/hooks";
import { useState } from "react";

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
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Unit</Table.Th>
            <Table.Th>Expiry Type</Table.Th>
            <Table.Th>Expiry Date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Labels</Table.Th>
            <Table.Th>Notes</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        {items?.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </Table>

      <Container style={{ position: "fixed", bottom: 50, right: 50 }}>
        <AddItemBtn />
      </Container>
    </Container>
  );
}

function ItemRow({ item }: { item: Item }) {
  const [quantity, setQuantity] = useState(item.quantity);
  const { mutate: updateItem } = useUpdateItem();

  const handleQuantityChange = useDebouncedCallback((value: number) => {
    updateItem({
      ...item,
      quantity: value,
      notes: item.notes.map((note) => note.note),
    });
  }, 1000);

  return (
    <Table.Tr>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>
        <NumberInput
          value={quantity}
          onChange={(value) => {
            setQuantity(value as number);
            handleQuantityChange(value as number);
          }}
        />
      </Table.Td>
      <Table.Td>{item.unit}</Table.Td>
      <Table.Td>{item.expiryType}</Table.Td>
      <Table.Td>{item.expiryDate}</Table.Td>
      <Table.Td>
        {new Date() < new Date(item.expiryDate) ? ":)" : ":("}
      </Table.Td>
      <Table.Td style={{ display: "flex", flexWrap: "wrap" }}>
        {item.labels.map((label) => (
          <div
            key={label.id}
            style={{
              backgroundColor: label.colour,
              borderRadius: "4px",
              padding: "4px",
            }}
          >
            {label.name}
          </div>
        ))}
      </Table.Td>
      <Table.Td>{item.notes.map((note) => note.note).join(", ")}</Table.Td>
      <Table.Td>
        <ItemActions item={item} />
      </Table.Td>
    </Table.Tr>
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

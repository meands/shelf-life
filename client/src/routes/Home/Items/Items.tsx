import {
  Button,
  Container,
  Modal,
  Table,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

const mockItems = [
  {
    name: "Banana",
    purchaseDate: new Date(),
    expiryDate: new Date(),
    category: "Fruit",
    notes: ["store in fridge", "eat before 2025-01-05"],
    expiryType: "best before",
  },
  {
    name: "Apple",
    purchaseDate: new Date(),
    expiryDate: new Date(),
    category: "Fruit",
    expiryType: "use by",
  },
  {
    name: "Orange",
    purchaseDate: new Date(),
    expiryDate: new Date(),
    category: "Fruit",
    expiryType: "use by",
  },
];

export function Items() {
  return (
    <Container>
      <Title>Items</Title>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Expiry Date</Table.Th>
            <Table.Th>Expiry Type</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Notes</Table.Th>
          </Table.Tr>
        </Table.Thead>

        {mockItems.map((item) => {
          return (
            <Table.Tr>
              <Table.Td>{item.name}</Table.Td>
              <Table.Td>{item.expiryDate.toLocaleDateString()}</Table.Td>
              <Table.Td>{item.expiryType}</Table.Td>
              <Table.Td>{item.category}</Table.Td>
              <Table.Td>{item.notes?.join(", ")}</Table.Td>
            </Table.Tr>
          );
        })}
      </Table>

      <AddItem />
    </Container>
  );
}

export function AddItem() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
      expiryDate: "",
      expiryType: "",
      category: "",
      notes: "",
    },
  });

  return (
    <Container
      size={420}
      my={40}
      style={{ position: "fixed", bottom: 0, right: 0 }}
    >
      <Modal opened={opened} onClose={close} title="Add Item">
        <form
          onSubmit={form.onSubmit((values) => {
            console.log(values);
          })}
        >
          <TextInput label="Name" />
          <TextInput label="Expiry Date" />
          <TextInput label="Expiry Type" />
          <TextInput label="Category" />
          <TextInput label="Notes" />

          <Button type="submit">Submit</Button>
        </form>
      </Modal>

      <Button onClick={open}>+ item</Button>
    </Container>
  );
}

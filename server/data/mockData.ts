import { ItemLabelRelationTable } from "@data/ItemLabelRelationTable";
import { ItemTable } from "@data/ItemTable";
import { LabelTable } from "@data/LabelTable";
import { NoteTable } from "@data/NoteTable";
import { ItemLabelRelation, Label, Note } from "@types";
import { UserTable } from "./UserTable";

const labels: Label[] = [
  {
    id: 1,
    name: "Freezer",
    colour: "#00ff00",
  },
  {
    id: 2,
    name: "Pantry",
    colour: "#ff0000",
  },
  {
    id: 3,
    name: "Fridge",
    colour: "#0000ff",
  },
  {
    id: 4,
    name: "Dairy",
    colour: "#228B22",
  },
  {
    id: 5,
    name: "Meat",
    colour: "#FF4500",
  },
];

const items = [
  {
    id: 1,
    name: "mince",
    quantity: 500,
    unit: "g",
    expiryDate: "2025-01-01",
    expiryType: "best before",
  },
  {
    id: 2,
    name: "banana",
    quantity: 1,
    unit: "piece",
    expiryDate: "2025-01-01",
    expiryType: "best before",
  },
  {
    id: 3,
    name: "milk",
    quantity: 1,
    unit: "litre",
    expiryDate: "2025-01-01",
    expiryType: "best before",
  },
  {
    id: 4,
    name: "bread",
    quantity: 1,
    unit: "slice",
    expiryDate: "2025-01-01",
    expiryType: "best before",
  },
  {
    id: 5,
    name: "cheese",
    quantity: 1,
    unit: "slice",
    expiryDate: "2025-01-01",
    expiryType: "best before",
  },
];

const notes: Note[] = [
  {
    id: 1,
    note: "store in fridge",
  },
  {
    id: 2,
    note: "from tesco",
  },
  {
    id: 3,
    note: "good for breakfast",
  },
  {
    id: 4,
    note: "good for lunch",
  },
  {
    id: 5,
    note: "good for dinner",
  },
];

const itemLabelRelations: ItemLabelRelation[] = [
  {
    itemId: 1,
    labelId: 1,
  },
  {
    itemId: 2,
    labelId: 2,
  },
  {
    itemId: 3,
    labelId: 4,
  },
  {
    itemId: 4,
    labelId: 5,
  },
  {
    itemId: 5,
    labelId: 3,
  },
  {
    itemId: 1,
    labelId: 2,
  },
];

const itemNoteRelations = [
  {
    itemId: 1,
    noteId: 1,
  },
  {
    itemId: 2,
    noteId: 2,
  },
  {
    itemId: 1,
    noteId: 3,
  },
  {
    itemId: 1,
    noteId: 4,
  },
  {
    itemId: 1,
    noteId: 5,
  },
];

const users = [
  {
    id: 1,
    displayName: "user1",
    email: "abc@abc.com",
    password: "abcde12345",
    role: "admin",
  },
  {
    id: 2,
    displayName: "user2",
    email: "xyz@abc.com",
    password: "xyz12345",
    role: "user",
  },
];

const userItemRelations = [
  {
    userId: 1,
    itemId: 1,
  },
  {
    userId: 1,
    itemId: 2,
  },
  {
    userId: 1,
    itemId: 3,
  },
  {
    userId: 2,
    itemId: 4,
  },
  {
    userId: 2,
    itemId: 5,
  },
];

export const roles = [
  {
    role: "admin",
    permissions: ["read_item", "create_item", "update_item", "delete_item"],
  },
  {
    role: "user",
    permissions: ["read_item", "create_item", "update_item", "delete_item"],
  },
];

export const labelTable = new LabelTable(labels);
export const itemTable = new ItemTable(items);
export const itemLabelRelationTable = new ItemLabelRelationTable(
  itemLabelRelations
);
export const noteTable = new NoteTable(notes, itemNoteRelations);
export const userTable = new UserTable(users, userItemRelations, itemTable);

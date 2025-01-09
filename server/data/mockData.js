const labels = [
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

class LabelTable {
    constructor(labels) {
        this.labels = labels;
        this.idCount = labels.length + 1;
    }

    getNextId() {
        return this.idCount;
    }

    addLabel(label) {
        const newLabel = { ...label, id: this.idCount };
        this.labels.push(newLabel);
        this.idCount++;
        return newLabel;
    }

    removeLabel(label) {
        this.labels = this.labels.filter(l => l.id !== label.id);
    }

    updateLabel(label) {
        const index = this.labels.findIndex(l => l.id === label.id);
        this.labels[index] = { ...label, id: this.labels[index].id };
    }

    getLabel(id) {
        return this.labels.find(l => l.id === id);
    }

    getLabelByName(name) {
        return this.labels.find(l => l.name === name);
    }

    getAllLabels() {
        return this.labels;
    }
}

const items = [
    {
        id: 1,
        name: "mince",
        quantity: 500,
        unit: 'g',
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

class ItemTable {
    constructor(items) {
        this.items = items;
        this.idCount = items.length + 1;
    }

    addItem(item) {
        const newItem = { ...item, id: this.idCount };
        this.items.push(newItem);
        this.idCount++;
        return newItem;
    }

    removeItem(id) {
        const item = this.getItem(id);
        if (item) {
            this.items = this.items.filter(i => i.id !== id);
            return item;
        }
        return null;
    }

    updateItem(item) {
        const index = this.items.findIndex(i => i.id === item.id);
        if (index !== -1) {
            this.items[index] = { ...item, id: this.items[index].id };
            return this.items[index];
        }
        return null;
    }

    getItem(id) {
        return this.items.find(i => i.id === id);
    }

    getAllItems() {
        return this.items;
    }

    getNextId() {
        return this.idCount;
    }
}

const itemLabelRelations = [
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

class ItemLabelRelationTable {
    constructor(relations) {
        this.relations = relations;
    }

    addRelation(itemId, labelId) {
        if (!this.getRelation(itemId, labelId)) {
            this.relations.push({ itemId, labelId });
        }
    }

    removeRelation(itemId, labelId) {
        this.relations = this.relations.filter(
            r => !(r.itemId === itemId && r.labelId === labelId)
        );
    }

    removeItemRelations(itemId) {
        this.relations = this.relations.filter(r => r.itemId !== itemId);
    }

    removeLabelRelations(labelId) {
        this.relations = this.relations.filter(r => r.labelId !== labelId);
    }

    getRelation(itemId, labelId) {
        return this.relations.find(
            r => r.itemId === itemId && r.labelId === labelId
        );
    }

    getItemLabels(itemId) {
        return this.relations.filter(r => r.itemId === itemId);
    }

    getLabelItems(labelId) {
        return this.relations.filter(r => r.labelId === labelId);
    }

    getAllRelations() {
        return this.relations;
    }

    updateItemLabels(itemId, labelIds) {
        // Remove all existing relations for this item
        this.removeItemRelations(itemId);
        // Add new relations
        labelIds.forEach(labelId => this.addRelation(itemId, labelId));
    }
}

const notes = [
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
        note: 'good for breakfast'
    },
    {
        id: 4,
        note: 'good for lunch'
    },
    {
        id: 5,
        note: 'good for dinner'
    }
]

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
]

class NoteTable {
    constructor(notes, itemNoteRelations) {
        this.notes = notes;
        this.itemNoteRelations = itemNoteRelations;
        this.idCount = notes.length + 1;
    }

    getRecordByNote(note) {
        return this.notes.find(n => n.note === note);
    }

    getNote(id) {
        return this.notes.find(n => n.id === id);
    }

    addNote(itemId, note) {
        const newNote = { note, id: this.idCount };
        this.notes.push(newNote);
        this.itemNoteRelations.push({ itemId, noteId: newNote.id });
        this.idCount++;
        return newNote;
    }

    removeNote(id) {
        this.notes = this.notes.filter(n => n.id !== id);
        this.itemNoteRelations = this.itemNoteRelations.filter(r => r.noteId !== id);
    }

    updateNote(note) {
        const index = this.notes.findIndex(n => n.id === note.id);
        this.notes[index] = { ...note, id: this.notes[index].id };
    }

    getItemNotes(itemId) {
        return this.itemNoteRelations.filter(r => r.itemId === itemId).map(r => this.notes.find(n => n.id === r.noteId));
    }
}

module.exports = {
    labelTable: new LabelTable(labels),
    itemTable: new ItemTable(items),
    itemLabelRelationTable: new ItemLabelRelationTable(itemLabelRelations),
    noteTable: new NoteTable(notes, itemNoteRelations)
}; 
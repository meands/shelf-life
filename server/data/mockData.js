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
    }
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
        notes: ["store in fridge"],
    },
    {
        id: 2,
        name: "banana",
        quantity: 1,
        unit: "piece",
        expiryDate: "2025-01-01",
        expiryType: "best before",
        notes: ["store in fridge"],
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


module.exports = {
    labelTable: new LabelTable(labels),
    itemTable: new ItemTable(items),
    itemLabelRelationTable: new ItemLabelRelationTable(itemLabelRelations)
}; 
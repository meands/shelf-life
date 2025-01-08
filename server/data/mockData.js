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

const items = [
    {
        id: 1,
        name: "mince",
        unit: '500g',
        expiryDate: "2025-01-01",
        expiryType: "best before",
        notes: ["store in fridge"],
    },
    {
        id: 2,
        name: "banana",
        unit: "1",
        expiryDate: "2025-01-01",
        expiryType: "best before",
        notes: ["store in fridge"],
    },
];

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

module.exports = {
    labels,
    items,
    itemLabelRelations
}; 
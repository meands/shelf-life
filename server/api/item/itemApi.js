const express = require('express');
const router = express.Router();

let items = [
    {
        id: 1,
        name: "mince",
        unit: '500g',
        expiryDate: "2025-01-01",
        expiryType: "best before",
        category: "Food",
        notes: ["store in fridge"],
    },
    {
        id: 2,
        name: "banana",
        expiryDate: "2025-01-01",
        expiryType: "best before",
        category: "Food",
        notes: ["store in fridge"],
    },
];

router.get('/', (req, res) => {
    res.status(200).json(items);
});

router.get('/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
});

router.post("/", (req, res) => {
    const newItem = {
        id: items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1,
        ...req.body,
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

router.put('/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Item not found" });

    items[index] = {
        ...items[index],
        ...req.body,
        id: items[index].id, // preserve the original id
    };
    res.json(items[index]);
});

router.delete("/:id", (req, res) => {
    const index = items.findIndex((i) => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: "Item not found" });

    const deletedItem = items[index];
    items = items.filter(i => i.id !== parseInt(req.params.id));
    res.json(deletedItem);
});

module.exports = router;

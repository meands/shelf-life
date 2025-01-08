const express = require('express');
const router = express.Router();
const { items, labels, itemLabelRelations } = require('../../data/mockData');

router.get('/', (req, res) => {
    res.status(200).json(items.getAllItems().map(item => ({
        ...item,
        labels: labels.getAllLabels().filter(label => itemLabelRelations.getAllRelations().find(relation => relation.itemId === item.id && relation.labelId === label.id))
    })));
});

router.get('/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ ...item, labels: labels.getAllLabels().filter(label => itemLabelRelations.getAllRelations().find(relation => relation.itemId === item.id && relation.labelId === label.id)) });
});

router.post("/", (req, res) => {
    const newItem = {
        id: items.getNextId(),
        ...req.body,
    };
    items.addItem(newItem);
    if (req.body.labels) {
        updateLabelTable(newItem.id, labels.getAllLabels().filter(label => itemLabelRelations.getAllRelations().find(relation => relation.itemId === newItem.id && relation.labelId === label.id)), req.body.labels);
    }
    res.status(201).json(newItem);
});

router.put('/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.getItem(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const updatedItem = {
        ...item,
        ...req.body,
        id: itemId,
    };
    items.updateItem(updatedItem);

    if (req.body.labels) {
        updateLabelTable(itemId, labels.getAllLabels().filter(label =>
            itemLabelRelations.getAllRelations().find(relation => relation.itemId === itemId && relation.labelId === label.id)
        ), req.body.labels);
    }
    res.json(updatedItem);
});

router.delete("/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.getItem(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    items.removeItem(itemId);
    res.json(item);
});

function updateLabelTable(itemId, previousLabels, currentLabels) {
    for (const label of currentLabels) {
        const existingLabel = previousLabels.find(l => l.name === label.name);
        if (!existingLabel) {
            const res = labels.addLabel(label);
            itemLabelRelations.addRelation(itemId, res.id);
        }
    }
    for (const label of previousLabels) {
        if (!currentLabels.find(l => l.name === label.name)) {
            itemLabelRelations.removeRelation(itemId, label.id);
        }
    }
}

module.exports = router;

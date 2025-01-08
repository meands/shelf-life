const express = require('express');
const router = express.Router();
const { items, labels, itemLabelRelations } = require('../../data/mockData');

router.get('/', (req, res) => {
    res.status(200).json(items.map(item => ({
        ...item,
        labels: labels.filter(label => itemLabelRelations.find(relation => relation.itemId === item.id && relation.labelId === label.id))
    })));
});

router.get('/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ ...item, labels: labels.filter(label => itemLabelRelations.find(relation => relation.itemId === item.id && relation.labelId === label.id)) });
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
    if (req.body.labels) {
        const newLabels = req.body.labels.filter(label => !labels.find(l => l.name === label.name));
        const removedLabels = labels.filter(label => !req.body.labels.find(l => l.name === label.name) && !newLabels.find(l => l.name === label.name));

        // console.log(removedLabels, newLabels);

        // for (const label of removedLabels) {
        //     delete labels[labels.findIndex(l => l.name === label.name)];
        //     delete itemLabelRelations[itemLabelRelations.findIndex(relation => relation.labelId === label.id)];
        // }
        for (const label of newLabels) {
            labels.push({
                ...label,
                id: labels.length > 0 ? Math.max(...labels.map(l => l.id)) + 1 : 1,
            });
            itemLabelRelations.push({
                itemId: items[index].id,
                labelId: labels.find(l => l.name === label.name).id,
            });
        }
    }
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

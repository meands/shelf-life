const express = require('express');
const router = express.Router();
const { itemLabelRelations, labels } = require('../../data/mockData');

router.get('/', (req, res) => {
    res.status(200).json(labels);
});

router.get('/:id', (req, res) => {
    const label = labels.find(l => l.id === parseInt(req.params.id));
    if (!label) return res.status(404).json({ message: 'Label not found' });
    res.status(200).json(label);
});

router.post('/', (req, res) => {
    const newLabel = {
        id: labels.length > 0 ? Math.max(...labels.map(l => l.id)) + 1 : 1,
        ...req.body
    };
    labels.push(newLabel);
    res.status(201).json(newLabel);
});

router.put('/:id', (req, res) => {
    const index = labels.findIndex(l => l.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Label not found' });

    labels[index] = {
        ...labels[index],
        ...req.body,
        id: labels[index].id
    };
    res.json(labels[index]);
});

router.delete('/:id', (req, res) => {
    const index = labels.findIndex(l => l.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Label not found' });

    const deletedLabel = labels[index];
    // can only delete if no items are associated with it
    if (itemLabelRelations.some(relation => relation.labelId === parseInt(req.params.id))) {
        return res.status(400).json({ message: 'Cannot delete label as it is associated with items' });
    }
    delete labels[index];
    delete itemLabelRelations[index];
    res.json(deletedLabel);
});

module.exports = router; 
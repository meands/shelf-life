const express = require('express');
const router = express.Router();
const { itemLabelRelations, labels } = require('../../data/mockData');

router.get('/', (req, res) => {
    res.status(200).json(labels.getAllLabels());
});

router.get('/:id', (req, res) => {
    const label = labels.getLabel(parseInt(req.params.id));
    if (!label) return res.status(404).json({ message: 'Label not found' });
    res.status(200).json(label);
});

router.post('/', (req, res) => {
    labels.addLabel(req.body);
    res.status(201).json(req.body);
});

router.put('/:id', (req, res) => {
    labels.updateLabel(req.body);
    res.status(201).json(req.body);
});

router.delete('/:id', (req, res) => {
    if (labels.getLabel(parseInt(req.params.id))) {
        if (itemLabelRelations.getAllRelations().some(relation => relation.labelId === parseInt(req.params.id))) {
            return res.status(400).json({ message: 'Cannot delete label as it is associated with items' });
        }
        labels.removeLabel(req.body);
        res.status(201).json(req.body);
    } else {
        res.status(404).json({ message: 'Label not found' });
    }
});

module.exports = router; 
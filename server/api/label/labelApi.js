const express = require('express');
const router = express.Router();
const { itemLabelRelationTable, labelTable } = require('../../data/mockData');

router.get('/', (req, res) => {
    res.status(200).json(labelTable.getAllLabels());
});

router.get('/:id', (req, res) => {
    const label = labelTable.getLabel(parseInt(req.params.id));
    if (!label) return res.status(404).json({ message: 'Label not found' });
    res.status(200).json(label);
});

router.post('/', (req, res) => {
    labelTable.addLabel(req.body);
    res.status(201).json(req.body);
});

router.put('/:id', (req, res) => {
    labelTable.updateLabel(req.body);
    res.status(201).json(req.body);
});

router.delete('/:id', (req, res) => {
    if (labelTable.getLabel(parseInt(req.params.id))) {
        if (itemLabelRelationTable.getAllRelations().some(relation => relation.labelId === parseInt(req.params.id))) {
            return res.status(400).json({ message: 'Cannot delete label as it is associated with items' });
        }
        labelTable.removeLabel(req.body);
        res.status(201).json(req.body);
    } else {
        res.status(404).json({ message: 'Label not found' });
    }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const { itemTable, labelTable, itemLabelRelationTable, noteTable } = require('../../data/mockData');

router.get('/', (req, res) => {
    res.status(200).json(itemTable.getAllItems().map(item => ({
        ...item,
        labels: labelTable.getAllLabels().filter(label => itemLabelRelationTable.getAllRelations().find(relation => relation.itemId === item.id && relation.labelId === label.id)),
        notes: noteTable.getItemNotes(item.id)
    })));
});

router.get('/:id', (req, res) => {
    const item = itemTable.getItem(parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ ...item, labels: labelTable.getAllLabels().filter(label => itemLabelRelationTable.getAllRelations().find(relation => relation.itemId === item.id && relation.labelId === label.id)), notes: noteTable.getItemNotes(item.id) });
});

router.post("/", (req, res) => {
    const newItem = {
        id: itemTable.getNextId(),
        ...req.body,
    };
    itemTable.addItem(newItem);
    if (req.body.labels) {
        updateLabelTable(newItem.id, labelTable.getAllLabels().filter(label => itemLabelRelationTable.getAllRelations().find(relation => relation.itemId === newItem.id && relation.labelId === label.id)), req.body.labels);
    }
    if (req.body.notes) {
        updateNoteTable(newItem.id, req.body.notes);
    }
    res.status(201).json(newItem);
});

router.put('/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = itemTable.getItem(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const updatedItem = {
        ...item,
        ...req.body,
        id: itemId,
    };
    itemTable.updateItem(updatedItem);

    if (req.body.labels) {
        updateLabelTable(itemId, labelTable.getAllLabels().filter(label =>
            itemLabelRelationTable.getAllRelations().find(relation => relation.itemId === itemId && relation.labelId === label.id)
        ), req.body.labels);
    }
    if (req.body.notes) {
        updateNoteTable(itemId, req.body.notes);
    }
    res.json(updatedItem);
});

router.delete("/:id", (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = itemTable.getItem(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    itemTable.removeItem(itemId);
    res.json(item);
});

function updateLabelTable(itemId, previousLabels, currentLabels) {
    for (const label of currentLabels) {
        const existingLabel = previousLabels.find(l => l.name === label.name);
        if (!existingLabel) {
            const res = labelTable.addLabel(label);
            itemLabelRelationTable.addRelation(itemId, res.id);
        }
    }
    for (const label of previousLabels) {
        if (!currentLabels.find(l => l.name === label.name)) {
            itemLabelRelationTable.removeRelation(itemId, label.id);
        }
    }
}

function updateNoteTable(itemId, currentNotes) {
    const allNotes = noteTable.getItemNotes(itemId);

    const notesToRemove = allNotes.filter(note => !currentNotes.find(n => n === note.note));

    for (const note of currentNotes) {
        const existingNote = noteTable.getRecordByNote(note);
        if (!existingNote) {
            noteTable.addNote(itemId, note);
        }
    }

    for (const note of notesToRemove) {
        noteTable.removeNote(noteTable.getRecordByNote(note.note).id);
    }
}

module.exports = router;

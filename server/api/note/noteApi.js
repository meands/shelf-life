const express = require('express');
const router = express.Router();
const { noteTable } = require('../../data/mockData');

// Get all notes for a specific item
router.get('/:itemId', (req, res) => {
    const itemId = parseInt(req.params.itemId);
    const itemNotes = noteTable.getItemNotes(itemId);
    const notes = itemNotes.map(relation =>
        noteTable.notes.find(note => note.id === relation.noteId)
    );
    res.status(200).json(notes);
});

// Add a new note to an item
router.post('/', (req, res) => {
    const itemId = parseInt(req.body.itemId);
    const newNote = noteTable.addNote(itemId, {
        note: req.body.note
    });
    res.status(201).json(newNote);
});

// Update a note for an item
router.put('/', (req, res) => {
    const itemId = parseInt(req.body.itemId);
    const noteId = parseInt(req.body.noteId);

    // Check if the note exists and belongs to the item
    const itemNote = noteTable.getItemNotes(itemId)
        .find(relation => relation.noteId === noteId);
    if (!itemNote) return res.status(404).json({ message: 'Note not found for this item' });

    const updatedNote = {
        id: noteId,
        note: req.body.note
    };
    noteTable.updateNote(updatedNote);
    res.json(updatedNote);
});

// Delete a note from an item
router.delete('/', (req, res) => {
    const itemId = parseInt(req.body.itemId);
    const noteId = parseInt(req.body.noteId);

    // Check if the note exists and belongs to the item
    const itemNote = noteTable.getItemNotes(itemId)
        .find(relation => relation.noteId === noteId);
    if (!itemNote) return res.status(404).json({ message: 'Note not found for this item' });

    noteTable.removeNote(noteId);
    res.json({ message: 'Note deleted successfully' });
});

// Update a note
router.put('/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const note = noteTable.notes.find(n => n.id === noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const updatedNote = {
        ...note,
        ...req.body,
        id: noteId
    };
    noteTable.updateNote(updatedNote);
    res.json(updatedNote);
});

// Delete a note
router.delete('/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const note = noteTable.notes.find(n => n.id === noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    noteTable.removeNote(noteId);
    res.json(note);
});

module.exports = router;

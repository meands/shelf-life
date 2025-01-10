import express, { Request, Response } from "express";
import { noteTable } from "../../data/mockData";
import { CreateNoteRequest, UpdateNoteRequest } from "../../types";

const router = express.Router();

router.get("/:itemId", (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId);
  const notes = noteTable.getItemNotes(itemId);
  res.status(200).json(notes);
});

router.post("/", (req: Request, res: Response) => {
  const noteData = req.body as CreateNoteRequest;
  const newNote = noteTable.addNote(noteData.itemId, noteData.note);
  res.status(201).json(newNote);
});

router.put("/", (req: Request, res: Response) => {
  const noteData = req.body as UpdateNoteRequest;
  const itemNotes = noteTable.getItemNotes(noteData.itemId);
  const existingNote = itemNotes.find((note) => note.id === noteData.id);

  if (!existingNote) {
    res.status(404).json({ message: "Note not found for this item" });
    return;
  }

  const updatedNote = {
    id: noteData.id,
    note: noteData.note,
  };
  noteTable.updateNote(updatedNote);
  res.json(updatedNote);
});

router.delete("/", (req: Request, res: Response) => {
  const { itemId, noteId } = req.body as { itemId: number; noteId: number };
  const itemNotes = noteTable.getItemNotes(itemId);
  const existingNote = itemNotes.find((note) => note.id === noteId);

  if (!existingNote) {
    res.status(404).json({ message: "Note not found for this item" });
    return;
  }

  noteTable.removeNote(noteId);
  res.json({ message: "Note deleted successfully" });
});

export default router;

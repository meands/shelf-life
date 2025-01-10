import { Note, ItemNoteRelation } from "@types";

export class NoteTable {
  private notes: Note[];
  private itemNoteRelations: ItemNoteRelation[];
  private idCount: number;

  constructor(notes: Note[], itemNoteRelations: ItemNoteRelation[]) {
    this.notes = notes;
    this.itemNoteRelations = itemNoteRelations;
    this.idCount = notes.length + 1;
  }

  public getRecordByNote(note: string): Note | undefined {
    return this.notes.find((n) => n.note === note);
  }

  public getNote(id: number): Note | undefined {
    return this.notes.find((n) => n.id === id);
  }

  public addNote(itemId: number, note: string): Note {
    const newNote: Note = { note, id: this.idCount };
    this.notes.push(newNote);
    this.itemNoteRelations.push({ itemId, noteId: newNote.id });
    this.idCount++;
    return newNote;
  }

  public removeNote(id: number): void {
    this.notes = this.notes.filter((n) => n.id !== id);
    this.itemNoteRelations = this.itemNoteRelations.filter(
      (r) => r.noteId !== id
    );
  }

  public updateNote(note: Note): void {
    const index = this.notes.findIndex((n) => n.id === note.id);
    this.notes[index] = { ...note, id: this.notes[index].id };
  }

  public getItemNotes(itemId: number): Note[] {
    return this.itemNoteRelations
      .filter((r) => r.itemId === itemId)
      .map((r) => this.notes.find((n) => n.id === r.noteId))
      .filter((note): note is Note => note !== undefined);
  }
}

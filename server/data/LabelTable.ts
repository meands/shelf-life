import { Label } from "@types";

export class LabelTable {
  private labels: Label[];
  private idCount: number;

  constructor(labels: Label[]) {
    this.labels = labels;
    this.idCount = labels.length + 1;
  }

  public getNextId(): number {
    return this.idCount;
  }

  public addLabel(label: Omit<Label, "id">): Label {
    const newLabel = { ...label, id: this.idCount };
    this.labels.push(newLabel);
    this.idCount++;
    return newLabel;
  }

  public removeLabel(label: Label): void {
    this.labels = this.labels.filter((l) => l.id !== label.id);
  }

  public updateLabel(label: Label): void {
    const index = this.labels.findIndex((l) => l.id === label.id);
    if (index !== -1) {
      this.labels[index] = { ...label, id: this.labels[index].id };
    }
  }

  public getLabel(id: number): Label | undefined {
    return this.labels.find((l) => l.id === id);
  }

  public getLabelByName(name: string): Label | undefined {
    return this.labels.find((l) => l.name === name);
  }

  public getAllLabels(): Label[] {
    return this.labels;
  }
}

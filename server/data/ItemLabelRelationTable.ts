import { ItemLabelRelation } from "@types";

export class ItemLabelRelationTable {
  private relations: ItemLabelRelation[];

  constructor(relations: ItemLabelRelation[]) {
    this.relations = relations;
  }

  public addRelation(itemId: number, labelId: number): void {
    if (!this.getRelation(itemId, labelId)) {
      this.relations.push({ itemId, labelId });
    }
  }

  public removeRelation(itemId: number, labelId: number): void {
    this.relations = this.relations.filter(
      (r) => !(r.itemId === itemId && r.labelId === labelId)
    );
  }

  public removeItemRelations(itemId: number): void {
    this.relations = this.relations.filter((r) => r.itemId !== itemId);
  }

  public removeLabelRelations(labelId: number): void {
    this.relations = this.relations.filter((r) => r.labelId !== labelId);
  }

  public getRelation(
    itemId: number,
    labelId: number
  ): ItemLabelRelation | undefined {
    return this.relations.find(
      (r) => r.itemId === itemId && r.labelId === labelId
    );
  }

  public getItemLabels(itemId: number): ItemLabelRelation[] {
    return this.relations.filter((r) => r.itemId === itemId);
  }

  public getLabelItems(labelId: number): ItemLabelRelation[] {
    return this.relations.filter((r) => r.labelId === labelId);
  }

  public getAllRelations(): ItemLabelRelation[] {
    return this.relations;
  }

  public updateItemLabels(itemId: number, labelIds: number[]): void {
    // Remove all existing relations for this item
    this.removeItemRelations(itemId);
    // Add new relations
    labelIds.forEach((labelId) => this.addRelation(itemId, labelId));
  }
}

interface Item {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  expiryType: string;
}

export class ItemTable {
  private items: Item[];
  private idCount: number;

  constructor(items: Item[]) {
    this.items = items;
    this.idCount = items.length + 1;
  }

  public addItem(item: Omit<Item, "id"> & { id?: number }): Item {
    const newItem = { ...item, id: this.idCount };
    this.items.push(newItem);
    this.idCount++;
    return newItem;
  }

  public removeItem(id: number): Item | null {
    const item = this.getItem(id);
    if (item) {
      this.items = this.items.filter((i) => i.id !== id);
      return item;
    }
    return null;
  }

  public updateItem(item: Item): Item | null {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      this.items[index] = { ...item, id: this.items[index].id };
      return this.items[index];
    }
    return null;
  }

  public getItem(id: number): Item | undefined {
    return this.items.find((i) => i.id === id);
  }

  public getAllItems(): Item[] {
    return this.items;
  }

  public getNextId(): number {
    return this.idCount;
  }
}

import { User, UserItemRelation } from "@types";
import { ItemTable } from "./ItemTable";

export class UserTable {
  private users: User[];
  private userItemRelations: UserItemRelation[];
  private itemTable: ItemTable;

  constructor(
    users: User[],
    userItemRelations: UserItemRelation[],
    itemTable: ItemTable
  ) {
    this.users = users;
    this.userItemRelations = userItemRelations;
    this.itemTable = itemTable;
  }

  public getAllUsers() {
    return this.users;
  }

  public getUser(id: number) {
    return this.users.find((user) => user.id === id);
  }

  public getUserItems(userId: number) {
    return this.itemTable
      .getAllItems()
      .filter((record) =>
        this.userItemRelations.find(
          (relation) =>
            relation.itemId === record.id && relation.userId === userId
        )
      );
  }
}

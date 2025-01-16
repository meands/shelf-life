import {
  CreateUserRequest,
  Item,
  UpdateUserRequest,
  User,
} from "@shared/types";
import { ItemTable } from "./ItemTable";

export class UserTable {
  private users: User[];
  private userItemRelations: { userId: number; itemId: number }[];
  private itemTable: ItemTable;
  private idCount: number;

  constructor(
    users: User[],
    userItemRelations: { userId: number; itemId: number }[],
    itemTable: ItemTable
  ) {
    this.users = users;
    this.userItemRelations = userItemRelations;
    this.itemTable = itemTable;
    this.idCount = users.length + 1;
  }

  public getAllUsers(): User[] {
    return this.users;
  }

  public getUser(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  public createUser(user: CreateUserRequest): User {
    const newUser: User = {
      ...user,
      id: this.idCount++,
      role: user.role || "user",
    };
    this.users.push(newUser);
    return newUser;
  }

  public updateUser(user: UpdateUserRequest): User {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index === -1) throw new Error("User not found");

    const updatedUser = {
      ...this.users[index],
      ...user,
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  public deleteUser(id: number): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw new Error("User not found");

    this.users.splice(index, 1);
    this.userItemRelations = this.userItemRelations.filter(
      (relation) => relation.userId !== id
    );
  }

  public getUserItems(userId: number): Item[] | undefined {
    const user = this.getUser(userId);
    console.log(userId, user);

    if (!user) return undefined;

    const itemIds = this.userItemRelations
      .filter((relation) => relation.userId === userId)
      .map((relation) => relation.itemId);

    return itemIds
      .map((id) => this.itemTable.getItem(id))
      .filter((item): item is Item => item !== undefined);
  }

  public addUserItemRelation(itemId: number, userId: number): void {
    this.userItemRelations.push({ itemId, userId });
  }
}

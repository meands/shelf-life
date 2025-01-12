export { Item, Label, Note } from "@shared/types";
export { SignInRequest, SignInResponse, WelcomeResponse } from "@shared/types";
export { CreateItemRequest, UpdateItemRequest } from "@shared/types";
export { CreateLabelRequest, UpdateLabelRequest } from "@shared/types";
export { CreateNoteRequest, UpdateNoteRequest } from "@shared/types";
export { ApiResponse, ErrorResponse } from "@shared/types";
export { User } from "@shared/types";

export interface UserItemRelation {
  userId: number;
  itemId: number;
}

export interface ItemNoteRelation {
  itemId: number;
  noteId: number;
}

export interface ItemLabelRelation {
  itemId: number;
  labelId: number;
}

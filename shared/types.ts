import { Prisma } from "@prisma/client";

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  message: string;
}

export interface WelcomeResponse {
  message: string;
}

export interface NoteWithOptionalId {
  id?: number;
  note: string;
}

export interface LabelWithOptionalId {
  id?: number;
  name: string;
  colour: string;
  description: string | null;
}

export interface ReminderSettings {
  id?: number;
  daysBeforeExpiry: number;
  itemId?: number; // if null, applies to all items
  userId: number;
  isEnabled: boolean;
}

export interface CreateReminderRequest {
  daysBeforeExpiry: number;
  itemId?: number;
  isEnabled?: boolean;
}

export interface UpdateReminderRequest extends CreateReminderRequest {
  id: number;
}

export interface CreateItemRequest {
  name: string;
  quantity: number;
  unit: string;
  expiryDate: Date;
  expiryType: string;
  labels: LabelWithOptionalId[];
  notes: NoteWithOptionalId[];
  reminder?: CreateReminderRequest;
}

export interface UpdateItemRequest extends CreateItemRequest {
  id: number;
}

export interface CreateLabelRequest {
  name: string;
  colour: string;
  description?: string;
  itemIds?: number[];
}

export interface UpdateLabelRequest extends CreateLabelRequest {
  id: number;
}

export interface CreateNoteRequest {
  itemId: number;
  note: string;
}

export interface UpdateNoteRequest {
  id: number;
  itemId: number;
  note: string;
}

export interface CreateUserRequest {
  displayName: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserRequest {
  id: number;
  displayName?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

export type EnrichedItem = Prisma.ItemGetPayload<{
  include: { notes: true; labels: true; reminders: true };
}>;

export type ReminderWithItem = Prisma.ReminderGetPayload<{
  include: { item: true };
}>;

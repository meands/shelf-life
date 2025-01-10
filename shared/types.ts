// Authentication
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

// Items
export interface Item {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  expiryType: string;
  labels: Label[];
  notes: Note[];
}

export interface CreateItemRequest {
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  expiryType: string;
  labels: Label[];
  notes: string[];
}

export interface UpdateItemRequest extends CreateItemRequest {
  id: number;
}

// Labels
export interface Label {
  id: number;
  name: string;
  colour: string;
  description?: string;
}

export interface CreateLabelRequest {
  name: string;
  colour: string;
  description?: string;
}

export interface UpdateLabelRequest extends CreateLabelRequest {
  id: number;
}

// Notes
export interface Note {
  id: number;
  note: string;
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

// API Responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

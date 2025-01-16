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
interface Label {
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

// API Responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

import { Prisma } from "@prisma/client";

export { SignInRequest, SignInResponse, WelcomeResponse } from "@shared/types";
export { CreateItemRequest, UpdateItemRequest } from "@shared/types";
export { CreateLabelRequest, UpdateLabelRequest } from "@shared/types";
export { CreateNoteRequest, UpdateNoteRequest } from "@shared/types";
export { ApiResponse, ErrorResponse } from "@shared/types";
export { Label } from "@shared/types";

export type ItemWithNotesAndLabels = Prisma.ItemGetPayload<{
  include: { notes: true; labels: true };
}>;

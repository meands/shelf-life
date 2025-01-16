import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type ItemWithNotesAndLabels = Prisma.ItemGetPayload<{
  include: { notes: true; labels: true };
}>;

export default prisma;

import { Category, Note, User } from "@prisma/client";

export type NoteType = Note & {
  categories: Category[];
  user: User;
};

export type NoteInput = {
  title: string;
  description: string;
  isPublic: boolean;
  categories: Category[];
  userId?: number;
};

export type Category = {
  id: number;
  name: string;
};

export type Note = {
  id: number;
  title: string;
  description: string;
  categories: Category[];
  isPublic: boolean;
  userId: number;
};

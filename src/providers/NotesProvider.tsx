"use client";

import { useToast } from "@/components/ui/use-toast";
import { useAddCategory, useGetCategories } from "@/services/manageCategories";
import { Category, Note } from "@prisma/client";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type NotesContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  createCategory: (category: string) => void;
};

const NotesContext = createContext<NotesContextType>({
  categories: [],
  setCategories: () => {},
  notes: [],
  setNotes: () => {},
  createCategory: () => {},
});

type Props = { children: ReactNode };

export const NotesProvider = ({ children }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const { mutateAsync: getCategories } = useGetCategories();
  const { mutateAsync: addCategory } = useAddCategory();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();

      setCategories(response.categories);
    };
    fetchCategories();
  }, [getCategories]);

  const createCategory = async (category: string) => {
    try {
      const response = await addCategory({ name: category });
      if (response.status === 409) {
        return toast({
          title: "Error",
          description: "Category already exists",
          variant: "destructive",
        });
      }
      if (response.category) {
        setCategories([...categories, response.category]);
      }
      return toast({
        title: "Success",
        description: "Category created successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong when creating category",
        variant: "destructive",
      });
    }
  };
  return (
    <NotesContext.Provider
      value={{ categories, setCategories, notes, setNotes, createCategory }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NotesContext);
};

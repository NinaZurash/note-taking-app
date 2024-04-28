"use client";

import { useToast } from "@/components/ui/use-toast";
import {
  useAddCategory,
  useDeleteCategory,
  useGetCategories,
} from "@/services/manageCategories";
import {
  useAddNote,
  useDeleteNote,
  useGetNotes,
  useUpdateNote,
} from "@/services/manageNotes";
import { NoteInput, NoteType } from "@/types/noteTypes";
import { Category, Note } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  ReactNode,
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { set } from "zod";

type NotesContextType = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  notes: NoteType[];
  setNotes: (notes: NoteType[]) => void;
  createCategory: (category: string) => void;
  deleteCategory: (id: number) => void;
  createNote: (note: NoteInput) => void;
  deleteNote: (id: number) => void;
  updateNote: (note: NoteInput & { id: number }) => void;
};

const NotesContext = createContext<NotesContextType>({
  categories: [],
  setCategories: () => {},
  notes: [],
  setNotes: () => {},
  createCategory: () => {},
  deleteCategory: () => {},
  createNote: () => {},
  deleteNote: () => {},
  updateNote: () => {},
});

type Props = { children: ReactNode };

export const NotesProvider = ({ children }: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const { mutateAsync: getCategories } = useGetCategories();
  const { mutateAsync: getNotes } = useGetNotes();
  const { mutateAsync: addCategory } = useAddCategory();
  const { mutateAsync: removeCategory } = useDeleteCategory();
  const { mutateAsync: removeNote } = useDeleteNote();
  const { mutateAsync: addNote } = useAddNote();
  const { mutateAsync: mutateUpdateNote } = useUpdateNote();
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();

      setCategories(response.categories);
    };
    fetchCategories();
  }, [getCategories]);

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await getNotes();

      setNotes(response.notes);
    };
    fetchNotes();
  }, [getNotes]);

  const createCategory = async (category: string) => {
    try {
      const response = await addCategory({ name: category });
      console.log(response);
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

  const createNote = async (note: NoteInput) => {
    try {
      if (!session?.user)
        return toast({
          title: "Error",
          description: "Please login",
          variant: "destructive",
        });
      note.userId = session?.user?.id;
      const response = await addNote(note);

      if (!response.note) {
        setNotes([...notes, response.note]);
        return toast({
          title: "Error",
          description: "Something went wrong when creating note",
          variant: "destructive",
        });
      }
      setNotes([...notes, response.note]);
      return toast({
        title: "Success",
        description: "Note created successfully",
        variant: "success",
      });
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong when creating note",
        variant: "destructive",
      });
    }
  };
  const updateNote = async (note: NoteInput & { id: number }) => {
    const response = await mutateUpdateNote(note);
    if (response.status === 200) {
      setNotes(notes.map((n) => (n.id === note.id ? response.note : n)));
      return toast({
        title: "Success",
        description: "Note updated successfully",
        variant: "success",
      });
    } else {
      return toast({
        title: "Error",
        description: response.message,
        variant: "destructive",
      });
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      const response = await removeCategory(id);
      if (response.status === 200) {
        setCategories(categories.filter((category) => category.id !== id));
        return toast({
          title: "Success",
          description: "Category deleted successfully",
          variant: "success",
        });
      } else if (response.status === 400) {
        return toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong when deleting category",
        variant: "destructive",
      });
    }
  };
  const deleteNote = async (id: number) => {
    try {
      const response = await removeNote(id);
      if (response.status === 200) {
        setNotes(notes.filter((note) => note.id !== id));
        return toast({
          title: "Success",
          description: "Note deleted successfully",
          variant: "success",
        });
      } else if (response.status === 400) {
        return toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong when deleting note",
        variant: "destructive",
      });
    }
  };

  return (
    <NotesContext.Provider
      value={{
        categories,
        setCategories,
        notes,
        setNotes,
        createCategory,
        deleteCategory,
        createNote,
        deleteNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NotesContext);
};

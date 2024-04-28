"use client";

import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Check, ChevronsUpDown, EditIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNotes } from "@/providers/NotesProvider";
import { BADGE_COLORS, darkenColor } from "@/constants/badgeColors";
import { Category } from "@prisma/client";
import { useToast } from "../ui/use-toast";
import { Checkbox } from "../ui/checkbox";
import { NoteType } from "@/types/noteTypes";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  isPublic: z.boolean(),
  categories: z.array(z.number()),
});

export default function AddNoteModal({ note }: { note?: NoteType }) {
  const [chosenCategories, setChosenCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const { categories, createNote, updateNote } = useNotes();

  useEffect(() => {
    if (note) {
      setChosenCategories(note.categories);
    }
  }, [note]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: note
      ? {
          title: note.title,
          description: note.description,
          isPublic: note.isPublic,
          categories: note.categories.map((category) => category.id),
        }
      : {
          title: "",
          description: "",
          isPublic: false,
          categories: [],
        },
  });
  const handleApplyCategory = (value: string) => {
    if (
      chosenCategories.findIndex(
        (category) => category.id.toString() === value
      ) > -1
    ) {
      return setChosenCategories((prev: Category[]) =>
        prev.filter((category) => category.id.toString() !== value)
      );
    }

    const newCategory = categories.find(
      (category) => category.id.toString() === value
    );
    if (!newCategory) return;

    setChosenCategories((prev: Category[]) => [...prev, newCategory]);
    setOpen(false);
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (note) {
      updateNote({
        id: note.id,
        title: values.title,
        description: values.description,
        isPublic: values.isPublic,
        categories: chosenCategories,
      });
    } else {
      createNote({
        title: values.title,
        description: values.description,
        isPublic: values.isPublic,
        categories: chosenCategories,
      });
    }
    form.reset();
    setChosenCategories([]);
  };
  return (
    <Dialog>
      {note ? (
        <DialogTrigger asChild>
          <Button
            title="view/edit note"
            className="text-sm hover:bg-transparent bg-transparent text-black p-0 font-semibold hover:text-sky-700"
          >
            <EditIcon size={20} />
          </Button>
        </DialogTrigger>
      ) : (
        <DialogTrigger className="bg-indigo-500 absolute right-10 h-fit w-36 p-2 rounded-lg hover:bg-indigo-600 text-white">
          + Add Note
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mx-auto mb-8">Create a note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex-col flex"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="space-y-0 flex justify-end items-center gap-3">
                  <FormLabel>Public note</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {categories.length > 0 && (
              <div className="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
                <p className="text-sm font-medium leading-none">
                  {chosenCategories.map((category) => {
                    return (
                      <span
                        key={category.id}
                        style={{
                          backgroundColor: category.color,
                          color: darkenColor(category.color),
                        }}
                        className="font-semibold mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground"
                      >
                        {category.name}
                      </span>
                    );
                  })}

                  <span className="text-muted-foreground">
                    Add category to note
                  </span>
                </p>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      +
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Apply Category
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder="Filter label..."
                              autoFocus={true}
                              className="h-9"
                            />

                            <CommandGroup>
                              <CommandEmpty>No label found.</CommandEmpty>
                              <CommandList>
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.id + category.name}
                                    value={category.id.toString()}
                                    onSelect={handleApplyCategory}
                                  >
                                    {category.name}
                                  </CommandItem>
                                ))}
                              </CommandList>
                            </CommandGroup>
                          </Command>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setChosenCategories([]);
                        }}
                        className="text-red-600"
                      >
                        Clear
                        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <Button className="w-1/4 mx-auto mr-0" type="submit">
              {note ? "Update" : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

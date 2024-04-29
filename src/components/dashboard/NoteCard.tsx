"use client";

import { Category, Note, User } from "@prisma/client";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { NoteType } from "@/types/noteTypes";
import { darkenColor } from "@/constants/badgeColors";
import { Edit2Icon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useNotes } from "@/providers/NotesProvider";
import AddNoteModal from "./AddNoteModal";

export default function NoteCard({ note }: { note: NoteType }) {
  const { data: session } = useSession();
  const { deleteNote } = useNotes();

  const handleNoteDelete = (id: number) => {
    deleteNote(id);
  };
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-gray-900 text-xl h-16 line-clamp-2 shrink-0 dark:text-gray-50">
          {note.title}
        </CardTitle>
        <Badge
          className={
            note.isPublic
              ? " bg-green-100 w-fit text-green-600"
              : "bg-fuchsia-100 w-fit text-fuchsia-600"
          }
          variant="outline"
        >
          {note.isPublic ? "Public" : "Private"}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-gray-500 h-10 text-sm line-clamp-2 shrink-0 dark:text-gray-400">
          {note.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {note.categories.map((category) => (
            <Badge
              key={category.name}
              className=" border-gray-200"
              style={{
                backgroundColor: category.color,
                color: darkenColor(category.color),
              }}
            >
              {category.name[0].toUpperCase() + category.name.slice(1)}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2 items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created on {new Date(note.createdAt).toDateString()}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            by {note.user.username}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {session && Number(session.user.id) === note.userId ? (
          <div className="flex w-full items-center  justify-between">
            <AddNoteModal note={note} />
            <Button
              onClick={() => {
                handleNoteDelete(note.id);
              }}
              title="delete note"
              className="p-0 bg-transparent text-black hover:bg-transparent hover:text-red-600"
            >
              <TrashIcon size={20} />
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center  justify-between">
            <AddNoteModal note={note} disabled={true} />
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

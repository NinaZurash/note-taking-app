"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNotes } from "@/providers/NotesProvider";
import { Badge } from "../ui/badge";
import { darkenColor } from "@/constants/badgeColors";

export default function Home() {
  const { notes } = useNotes();
  console.log(notes);
  const sortedNotes = notes.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return (
    <div className="font-normal  from-neutral-100 text-xl">
      <div className="m-10 border rounded-3xl">
        <div className="py-6 px-4 font-medium">Latest Notes</div>
        <hr />
        <div className="h-1/2 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-fit">Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="text-right">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">{note.title}</TableCell>
                  <TableCell className="text-gray-400 font-medium ">
                    {note.user.username}
                  </TableCell>
                  <TableCell className="flex gap-1">
                    {note.categories.map((category) => {
                      return (
                        <Badge
                          key={category.name}
                          className=" border-gray-200"
                          style={{
                            backgroundColor: category.color,
                            color: darkenColor(category.color),
                          }}
                        >
                          {category.name[0].toUpperCase() +
                            category.name.slice(1)}
                        </Badge>
                      );
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(note.createdAt).getDate()}/
                    {(new Date(note.createdAt).getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}
                    /{new Date(note.createdAt).getFullYear()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

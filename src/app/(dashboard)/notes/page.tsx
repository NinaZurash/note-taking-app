"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import NoteCard from "@/components/dashboard/NoteCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AddNoteModal from "@/components/dashboard/AddNoteModal";
import { useNotes } from "@/providers/NotesProvider";
import { useSession } from "next-auth/react";
import { ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { NoteType } from "@/types/noteTypes";

export default function Component() {
  const { notes } = useNotes();
  const { data: session } = useSession();
  const [searchValue, setSearchValue] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteType[]>(notes);

  const userNotes = filteredNotes?.filter(
    (note) => note.userId === Number(session?.user.id)
  );

  const handleSearch = () => {
    if (searchValue) {
      const searchResults = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          note.description.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredNotes(searchResults);
    } else {
      setFilteredNotes(notes);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex w-full justify-between">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6 grid w-fit  grid-cols-2 h-fit p-2">
            <TabsTrigger className="text-lg" value="personal">
              Personal
            </TabsTrigger>
            <TabsTrigger className="text-lg" value="all">
              All Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            {notes && session?.user ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {userNotes.length > 0 ? (
                  userNotes.map((note) => {
                    return <NoteCard key={note.id} note={note} />;
                  })
                ) : (
                  <div>No notes found</div>
                )}
              </div>
            ) : (
              <div className="w-full h-full text-center mt-10">Loading...</div>
            )}
          </TabsContent>
          <TabsContent value="all">
            {notes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredNotes.map((note) => {
                  return (
                    note.isPublic && <NoteCard key={note.id} note={note} />
                  );
                })}
              </div>
            ) : (
              <div className="w-full h-full text-center mt-10">Loading...</div>
            )}
          </TabsContent>
        </Tabs>
        <div className="absolute ml-60 inline-flex h-fit p-1">
          <div className="flex py-1 items-center w-full max-w-md rounded-lg bg-white shadow-md dark:bg-gray-800">
            <div className="pl-4 text-gray-400 dark:text-gray-500">
              <Search className="h-5 w-5" />
            </div>
            <Input
              className="w-full focus:ring-2 rounded-l-lg focus:ring-transparent focus-visible:ring-transparent border-none bg-transparent py-3 pr-4 text-gray-800 focus:outline-none dark:text-gray-200"
              placeholder="Search..."
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              className="rounded-r-lg"
              variant="ghost"
            >
              <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </Button>
          </div>
        </div>
        <AddNoteModal />
      </div>
    </div>
  );
}

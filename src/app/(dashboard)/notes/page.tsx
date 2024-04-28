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

export default function Component() {
  const { notes } = useNotes();
  const { data: session } = useSession();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex w-full justify-between">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6 grid w-fit grid-cols-2 h-fit p-2">
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
                {notes.map((note) => {
                  return (
                    note.userId === Number(session?.user.id) && (
                      <NoteCard key={note.id} note={note} />
                    )
                  );
                })}
              </div>
            ) : (
              <div className="w-full h-full text-center mt-10">Loading...</div>
            )}
          </TabsContent>
          <TabsContent value="all">
            {notes ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {notes.map((note) => {
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
        <AddNoteModal />
      </div>
    </div>
  );
}

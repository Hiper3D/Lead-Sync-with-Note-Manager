import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertNote, type Note } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Fetch notes for a specific lead
export function useNotes(leadId: number | null) {
  return useQuery({
    queryKey: [api.notes.list.path, leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const url = buildUrl(api.notes.list.path, { leadId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch notes");
      return api.notes.list.responses[200].parse(await res.json());
    },
    enabled: !!leadId,
  });
}

// Create a new note
export function useCreateNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertNote) => {
      const res = await fetch(api.notes.create.path, {
        method: api.notes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.notes.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create note");
      }
      return api.notes.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate the specific lead's notes
      queryClient.invalidateQueries({
        queryKey: [api.notes.list.path, data.leadId],
      });
      toast({
        title: "Note saved",
        description: "Your note has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Delete a note
export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.notes.delete.path, { id });
      const res = await fetch(url, { method: api.notes.delete.method });
      
      if (!res.ok) throw new Error("Failed to delete note");
    },
    onSuccess: () => {
      // Invalidate all notes lists to be safe (or we could pass leadId to be specific)
      queryClient.invalidateQueries({ queryKey: [api.notes.list.path] });
      toast({
        title: "Note deleted",
        description: "The note has been removed.",
      });
    },
  });
}

// Generate AI Summary
export function useSummarize() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(api.ai.summarize.path, {
        method: api.ai.summarize.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
         throw new Error("Failed to generate summary");
      }
      return api.ai.summarize.responses[200].parse(await res.json());
    },
    onError: () => {
      toast({
        title: "AI Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    }
  });
}

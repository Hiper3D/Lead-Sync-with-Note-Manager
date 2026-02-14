import { useState } from "react";
import { Lead } from "@/hooks/use-leads";
import { useNotes, useCreateNote, useDeleteNote, useSummarize } from "@/hooks/use-notes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2, Trash2, CalendarDays, Bot } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface NotesModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotesModal({ lead, isOpen, onClose }: NotesModalProps) {
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  
  const { data: notes, isLoading: isLoadingNotes } = useNotes(lead?.id || null);
  const createNoteMutation = useCreateNote();
  const deleteNoteMutation = useDeleteNote();
  const summarizeMutation = useSummarize();

  const handleGenerateSummary = async () => {
    if (!content.trim()) return;
    const result = await summarizeMutation.mutateAsync(content);
    setSummary(result.summary);
  };

  const handleSave = async () => {
    if (!lead || !content.trim()) return;
    
    await createNoteMutation.mutateAsync({
      leadId: lead.id,
      content,
      summary: summary || null,
    });
    
    setContent("");
    setSummary("");
  };

  const handleDelete = async (id: number) => {
    await deleteNoteMutation.mutateAsync(id);
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b bg-muted/20">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20">
                {lead.name.charAt(0)}
              </div>
              <div>
                <DialogTitle className="text-2xl font-display">{lead.name}</DialogTitle>
                <DialogDescription className="text-base flex items-center gap-2">
                  <span className="font-medium text-primary">{lead.company.name}</span>
                  <span>•</span>
                  <span>{lead.email}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: Existing Notes */}
          <div className="flex-1 border-r border-border/50 bg-muted/10 flex flex-col min-h-0">
            <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">History</h3>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {notes?.length || 0} Notes
              </span>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {isLoadingNotes ? (
                  <div className="flex justify-center p-8 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : notes?.length === 0 ? (
                  <div className="text-center p-8 text-muted-foreground space-y-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <CalendarDays className="w-6 h-6 opacity-50" />
                    </div>
                    <p>No notes found.</p>
                    <p className="text-sm">Start by creating a new note on the right.</p>
                  </div>
                ) : (
                  notes?.map((note) => (
                    <div key={note.id} className="group bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-all hover:border-primary/20 animate-enter">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {note.createdAt && format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(note.id)}
                          disabled={deleteNoteMutation.isPending}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      
                      <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                        {note.content}
                      </p>

                      {note.summary && (
                        <div className="mt-4 pt-3 border-t border-border/50">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 mb-1.5">
                            <Bot className="w-3.5 h-3.5" />
                            AI Summary
                          </div>
                          <p className="text-xs text-muted-foreground italic bg-indigo-50/50 dark:bg-indigo-900/10 p-2 rounded-md">
                            "{note.summary}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel: New Note Form */}
          <div className="w-full md:w-[45%] flex flex-col bg-background p-6 gap-4 shadow-xl z-10">
            <h3 className="font-display font-semibold text-lg flex items-center gap-2">
              <span className="w-8 h-1 bg-primary rounded-full"></span>
              New Note
            </h3>
            
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Type your meeting notes, observations, or next steps here..."
                  className="w-full h-full resize-none p-4 text-base bg-muted/30 border-muted-foreground/20 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              {summary && (
                <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4 animate-enter">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                      <Sparkles className="w-4 h-4" />
                      Generated Summary
                    </div>
                    <button 
                      onClick={() => setSummary("")}
                      className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-sm text-foreground/80 italic">
                    {summary}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateSummary}
                  disabled={!content.trim() || summarizeMutation.isPending}
                  className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950"
                >
                  {summarizeMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {summarizeMutation.isPending ? "Analyzing..." : "AI Summary"}
                </Button>

                <Button 
                  onClick={handleSave}
                  disabled={!content.trim() || createNoteMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 min-w-[120px]"
                >
                  {createNoteMutation.isPending ? "Saving..." : "Save Note"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

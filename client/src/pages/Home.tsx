import { useState } from "react";
import { useLeads, type Lead } from "@/hooks/use-leads";
import { LeadCard } from "@/components/LeadCard";
import { NotesModal } from "@/components/NotesModal";
import { Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { data: leads, isLoading, error } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads?.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background">
      {/* Decorative Header Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent -z-10" />

      <main className="container max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-foreground">
              Lead Management
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Track your prospects, manage interactions, and leverage AI to summarize your meetings instantly.
            </p>
          </div>
          
          <div className="w-full md:w-96 relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </div>
            <Input 
              className="pl-10 h-12 rounded-2xl bg-white/80 backdrop-blur border-border/50 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-base"
              placeholder="Search leads by name, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground animate-pulse">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p>Loading your leads...</p>
          </div>
        ) : error ? (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-8 text-center max-w-md mx-auto">
            <h3 className="text-destructive font-semibold mb-2">Failed to load leads</h3>
            <p className="text-sm text-muted-foreground">Please check your internet connection and try again.</p>
          </div>
        ) : filteredLeads?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No leads found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 animate-enter">
            {filteredLeads?.map((lead) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                onAddNotes={setSelectedLead} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal Layer */}
      <NotesModal 
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}

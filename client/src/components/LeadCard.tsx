import { Lead } from "@/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotebookPen, Building2, Phone, Mail } from "lucide-react";

interface LeadCardProps {
  lead: Lead;
  onAddNotes: (lead: Lead) => void;
}

export function LeadCard({ lead, onAddNotes }: LeadCardProps) {
  return (
    <Card className="premium-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-primary/30">
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {lead.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              {lead.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-3.5 h-3.5" />
              <span>{lead.company.name}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground/80 pl-[3.25rem]">
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Mail className="w-3.5 h-3.5" />
            {lead.email}
          </div>
          <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Phone className="w-3.5 h-3.5" />
            {lead.phone}
          </div>
        </div>
      </div>

      <div className="w-full md:w-auto flex justify-end">
        <Button 
          onClick={() => onAddNotes(lead)}
          className="bg-white text-primary border-2 border-primary/20 hover:bg-primary/5 hover:border-primary shadow-sm hover:shadow-md transition-all font-semibold"
          size="lg"
        >
          <NotebookPen className="w-4 h-4 mr-2" />
          View Notes
        </Button>
      </div>
    </Card>
  );
}

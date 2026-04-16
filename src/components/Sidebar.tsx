import React from 'react';
import { Document } from '../types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface SidebarProps {
  documents: Document[];
  currentDocId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ documents, currentDocId, onSelect, onNew, onDelete }: SidebarProps) {
  return (
    <aside className="w-full md:w-[240px] bg-muted border-r border-border p-4 flex flex-col gap-5 h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-[11px] uppercase tracking-[1px] text-muted-foreground font-semibold mb-3">Recent Documents</h3>
        <ScrollArea className="flex-1 -mx-2 px-2">
          <ul className="space-y-1">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className={`group flex flex-col gap-1 px-3 py-2.5 rounded-md text-[14px] cursor-pointer transition-colors ${
                  currentDocId === doc.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
                onClick={() => onSelect(doc.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2 overflow-hidden flex-1">
                    <FileText className="h-4 w-4 shrink-0 opacity-70" />
                    <span className="truncate font-medium">{doc.title || 'Untitled'}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(doc.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center justify-between w-full pl-6">
                  <span className={`text-[11px] ${currentDocId === doc.id ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                    {format(new Date(doc.lastModified), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              </li>
            ))}
            {documents.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No documents yet.
              </div>
            )}
          </ul>
        </ScrollArea>
      </div>
      <div className="mt-auto pt-4 border-t border-border">
        <Button onClick={onNew} className="w-full bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground h-[34px] rounded-md text-[13px] flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> New Document
        </Button>
      </div>
    </aside>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Edit2, Check, Copy, Save, Sparkles, Pin, Cloud
} from 'lucide-react';
import { Note } from '../types';

interface PersonalNotesWidgetProps {
  notes: Note[];
  onAddNote: (title: string, content: string) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
}

export default function PersonalNotesWidget({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: PersonalNotesWidgetProps) {
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [copied, setCopied] = useState(false);

  // Sync active note on initial load or if empty
  useEffect(() => {
    if (notes.length > 0) {
      if (!activeNoteId || !notes.find(n => n.id === activeNoteId)) {
        setActiveNoteId(notes[0].id);
      }
    } else {
      setActiveNoteId(null);
    }
  }, [notes, activeNoteId]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNew = () => {
    const title = `Page ${notes.length + 1}`;
    const newId = `note-${Date.now()}`;
    onAddNote(title, '');
    setActiveNoteId(newId);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!activeNoteId) return;
    onUpdateNote(activeNoteId, { content: e.target.value, updatedAt: Date.now() });
  };

  const handleStartEditingTitle = () => {
    if (!activeNote) return;
    setTempTitle(activeNote.title);
    setIsEditingTitle(true);
  };

  const handleSaveTitle = () => {
    if (!activeNoteId || !tempTitle.trim()) {
      setIsEditingTitle(false);
      return;
    }
    onUpdateNote(activeNoteId, { title: tempTitle.trim() });
    setIsEditingTitle(false);
  };

  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculations
  const wordCount = activeNote?.content
    ? activeNote.content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = activeNote?.content ? activeNote.content.length : 0;

  return (
    <div 
      id="notes-widget-card" 
      className="card-glass-panel border rounded-3xl p-5 shadow-lg flex flex-col h-full min-h-[460px] transition-all duration-300 hover:shadow-2xl hover:border-white/30"
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-zinc-400">
          <FileText className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 font-sans">
            Notes & Clipboard
          </h3>
          <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-2.5 h-2.5" />
            Backend Sync
          </span>
        </div>

        <button
          id="new-note-tab-btn"
          onClick={handleCreateNew}
          className="p-1 px-2.5 rounded-lg text-xs font-semibold bg-white/60 dark:bg-white/5 border border-zinc-200/45 dark:border-white/5 text-zinc-655 dark:text-zinc-300 hover:bg-white/80 dark:hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
          title="Add Note Page"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Page</span>
        </button>
      </div>

      {/* Notebook Tabs */}
      <div id="notes-tabs-strip" className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-thin flex-shrink-0">
        {notes.map((note) => (
          <button
            key={note.id}
            id={`note-tab-${note.id}`}
            onClick={() => {
              setActiveNoteId(note.id);
              setIsEditingTitle(false);
            }}
            className={`text-xs px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1 cursor-pointer transition-all ${
              activeNoteId === note.id
                ? 'bg-white/50 dark:bg-white/10 border-zinc-200/60 dark:border-white/10 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
            }`}
          >
            <span className="truncate max-w-[80px]">{note.title}</span>
            {note.isPinned && <Pin className="w-2.5 h-2.5 text-indigo-500 flex-shrink-0" />}
          </button>
        ))}
        {notes.length === 0 && (
          <span className="text-[10px] font-mono text-zinc-400">No pages yet</span>
        )}
      </div>

      {activeNote ? (
        <div className="flex-1 flex flex-col min-h-0 mt-3 relative">
          {/* Note Controls / Title Edit */}
          <div className="flex items-center justify-between py-1 bg-white/30 dark:bg-zinc-950/20 px-3 rounded-xl border border-zinc-100/50 dark:border-white/5 mb-2 flex-shrink-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  id="edit-note-title-input"
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-850 dark:text-zinc-100 rounded px-2 py-0.5 outline-none font-semibold w-full max-w-[150px]"
                />
                <button
                  id="save-note-title-btn"
                  onClick={handleSaveTitle}
                  className="p-1 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/10 rounded"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-200 truncate max-w-[150px]">
                  {activeNote.title}
                </span>
                <button
                  id="rename-note-title-btn"
                  onClick={handleStartEditingTitle}
                  className="p-1 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 rounded transition-colors"
                  title="Rename"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {/* Pin Note Toggle */}
              <button
                id={`pin-note-btn-${activeNote.id}`}
                onClick={() => onUpdateNote(activeNote.id, { isPinned: !activeNote.isPinned })}
                className={`p-1 rounded transition-colors ${
                  activeNote.isPinned 
                    ? 'text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20' 
                    : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
                }`}
                title="Pin Note"
              >
                <Pin className="w-3.5 h-3.5" />
              </button>

              {/* Copy Note Content */}
              <button
                id="copy-note-btn"
                onClick={handleCopy}
                className={`p-1 rounded transition-colors ${
                  copied 
                    ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20' 
                    : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300'
                }`}
                title={copied ? 'Copied!' : 'Copy notes to clipboard'}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Delete Note Page */}
              <button
                id="delete-note-btn"
                onClick={() => onDeleteNote(activeNote.id)}
                className="p-1 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors"
                title="Delete Page"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="flex-1 min-h-0 relative">
            <textarea
              id="notes-content-textarea"
              value={activeNote.content}
              onChange={handleContentChange}
              placeholder="Start drafting thoughts or paste useful snippets... Saves automatically!"
              className="w-full h-full text-sm font-sans bg-white/20 dark:bg-zinc-950/20 border border-zinc-200/50 dark:border-white/10 rounded-2xl p-3.5 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/30 resize-none font-medium leading-relaxed"
            />
          </div>

          {/* Words and Characters Counters */}
          <div className="flex items-center justify-between text-[9px] text-zinc-455 font-mono px-1.5 pt-2 flex-shrink-0">
            <span>Last modified: {new Date(activeNote.updatedAt).toLocaleTimeString()}</span>
            <div className="flex gap-2">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{charCount} chars</span>
            </div>
          </div>
        </div>
      ) : (
        <div id="notes-empty-fallback" className="flex-1 flex flex-col items-center justify-center py-10 text-center">
          <FileText className="w-10 h-10 text-zinc-300 dark:text-zinc-700 stroke-[1.5] mb-2.5" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mb-1">No notes created yet</p>
          <button
            id="create-note-fallback-btn"
            onClick={handleCreateNew}
            className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-xl transition-all"
          >
            Create Your First Note
          </button>
        </div>
      )}
    </div>
  );
}

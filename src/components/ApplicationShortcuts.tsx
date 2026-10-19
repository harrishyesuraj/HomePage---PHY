import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Edit2, X, Settings, Sparkles, Globe, 
  ExternalLink, Check, RotateCcw, Pin, GripVertical
} from 'lucide-react';
import { QuickShortcut } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GoogleWaffleLogo, GoogleAppImage, resolveAppKey, extractDomain
} from './BrandLogos';

export interface PopularWebApp {
  id: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

interface ApplicationShortcutsProps {
  shortcuts: QuickShortcut[];
  onAddShortcut: (shortcut: Omit<QuickShortcut, 'id'>) => void;
  onUpdateShortcut?: (id: string, updates: Partial<QuickShortcut>) => void;
  onDeleteShortcut: (id: string) => void;
  onReorderShortcuts?: (shortcuts: QuickShortcut[]) => void;
}

export const getShortcutLogo = (shortcut: QuickShortcut) => {
  return (
    <GoogleAppImage 
      name={shortcut.iconName} 
      title={shortcut.title} 
      url={shortcut.url} 
      className="w-10 h-10" 
    />
  );
};

const GOOGLE_PRESET_APPS = [
  { id: 'account', name: 'Account', url: 'https://myaccount.google.com' },
  { id: 'drive', name: 'Drive', url: 'https://drive.google.com' },
  { id: 'gmail', name: 'Gmail', url: 'https://mail.google.com' },
  { id: 'youtube', name: 'YouTube', url: 'https://youtube.com' },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com' },
  { id: 'maps', name: 'Maps', url: 'https://maps.google.com' },
  { id: 'search', name: 'Search', url: 'https://google.com' },
  { id: 'calendar', name: 'Calendar', url: 'https://calendar.google.com' },
  { id: 'news', name: 'News', url: 'https://news.google.com' },
  { id: 'photos', name: 'Photos', url: 'https://photos.google.com' },
  { id: 'meet', name: 'Meet', url: 'https://meet.google.com' },
  { id: 'translate', name: 'Translate', url: 'https://translate.google.com' },
  { id: 'sheets', name: 'Sheets', url: 'https://sheets.google.com' },
  { id: 'docs', name: 'Docs', url: 'https://docs.google.com' },
  { id: 'keep', name: 'Keep', url: 'https://keep.google.com' },
  { id: 'classroom', name: 'Classroom', url: 'https://classroom.google.com' },
  { id: 'earth', name: 'Earth', url: 'https://earth.google.com' },
  { id: 'play', name: 'Play Store', url: 'https://play.google.com' },
  { id: 'contacts', name: 'Contacts', url: 'https://contacts.google.com' },
  { id: 'chrome', name: 'Chrome', url: 'https://chrome.google.com' },
];

const DEFAULT_POPULAR_APPS: PopularWebApp[] = [
  { id: 'github', name: 'GitHub', url: 'https://github.com' },
  { id: 'reddit', name: 'Reddit', url: 'https://reddit.com' },
  { id: 'spotify', name: 'Spotify', url: 'https://spotify.com' },
  { id: 'netflix', name: 'Netflix', url: 'https://netflix.com' },
  { id: 'discord', name: 'Discord', url: 'https://discord.com' },
  { id: 'x', name: 'X', url: 'https://x.com' },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com' },
  { id: 'notion', name: 'Notion', url: 'https://notion.so' },
  { id: 'figma', name: 'Figma', url: 'https://figma.com' },
  { id: 'wikipedia', name: 'Wikipedia', url: 'https://wikipedia.org' },
  { id: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com' },
  { id: 'slack', name: 'Slack', url: 'https://slack.com' },
  { id: 'stackoverflow', name: 'StackOverflow', url: 'https://stackoverflow.com' },
];

export default function ApplicationShortcuts({
  shortcuts,
  onAddShortcut,
  onDeleteShortcut,
  onReorderShortcuts,
}: ApplicationShortcutsProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeCatalogTab, setActiveCatalogTab] = useState<'google' | 'popular'>('popular');
  
  // Popular Web Apps persistent store
  const [popularApps, setPopularApps] = useState<PopularWebApp[]>(() => {
    const saved = localStorage.getItem('homepage_custom_popular_apps_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_POPULAR_APPS;
  });

  // Drag and reorder state for Popular Apps
  const [draggingPopId, setDraggingPopId] = useState<string | null>(null);
  const [dragOverPopId, setDragOverPopId] = useState<string | null>(null);

  // Drag and reorder state for Main Shortcuts Tray
  const [draggingShortcutId, setDraggingShortcutId] = useState<string | null>(null);
  const [dragOverShortcutId, setDragOverShortcutId] = useState<string | null>(null);

  // Drag mouse/touch long press helper state
  const longPressTimerRef = useRef<number | null>(null);
  const [isLongPressed, setIsLongPressed] = useState(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('homepage_custom_popular_apps_v2', JSON.stringify(popularApps));
  }, [popularApps]);

  // Listen for reset popular apps event dispatched from General Settings
  useEffect(() => {
    const handleResetEvent = () => {
      setPopularApps(DEFAULT_POPULAR_APPS);
      localStorage.setItem('homepage_custom_popular_apps_v2', JSON.stringify(DEFAULT_POPULAR_APPS));
      setEditingPopularAppId(null);
      setFeedbackMessage('Popular Web Apps reset to default!');
    };
    window.addEventListener('reset_popular_apps', handleResetEvent);
    return () => window.removeEventListener('reset_popular_apps', handleResetEvent);
  }, []);

  // Form input states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [targetDestination, setTargetDestination] = useState<'popular' | 'panel'>('popular');
  const [editingPopularAppId, setEditingPopularAppId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Right-click context menu state for popular web apps
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    app: PopularWebApp;
  } | null>(null);

  // Modal dialog state for adding/editing app via + button
  const [showAddAppModal, setShowAddAppModal] = useState(false);

  // Close context menu on any outside click or scroll
  useEffect(() => {
    if (!contextMenu) return;
    const handleClose = () => setContextMenu(null);
    window.addEventListener('click', handleClose);
    window.addEventListener('contextmenu', handleClose);
    window.addEventListener('scroll', handleClose, true);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('contextmenu', handleClose);
      window.removeEventListener('scroll', handleClose, true);
    };
  }, [contextMenu]);

  // Handlers for Popular Apps Drag and Drop Reordering
  const handlePopDragStart = (id: string, e: React.DragEvent) => {
    setDraggingPopId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePopDragOver = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverPopId !== id) {
      setDragOverPopId(id);
    }
  };

  const handlePopDrop = (targetId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingPopId || draggingPopId === targetId) {
      setDraggingPopId(null);
      setDragOverPopId(null);
      return;
    }

    setPopularApps(prev => {
      const fromIdx = prev.findIndex(item => item.id === draggingPopId);
      const toIdx = prev.findIndex(item => item.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;

      const updated = [...prev];
      const [movedItem] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, movedItem);
      return updated;
    });

    setFeedbackMessage('Order updated!');
    setDraggingPopId(null);
    setDragOverPopId(null);
  };

  const handlePopDragEnd = () => {
    setDraggingPopId(null);
    setDragOverPopId(null);
  };

  // Handlers for Tray Shortcuts Drag and Drop Reordering
  const handleShortcutDragStart = (id: string, e: React.DragEvent) => {
    setDraggingShortcutId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleShortcutDragOver = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverShortcutId !== id) {
      setDragOverShortcutId(id);
    }
  };

  const handleShortcutDrop = (targetId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingShortcutId || draggingShortcutId === targetId) {
      setDraggingShortcutId(null);
      setDragOverShortcutId(null);
      return;
    }

    const fromIdx = shortcuts.findIndex(s => s.id === draggingShortcutId);
    const toIdx = shortcuts.findIndex(s => s.id === targetId);
    if (fromIdx !== -1 && toIdx !== -1) {
      const updated = [...shortcuts];
      const [movedItem] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, movedItem);
      if (onReorderShortcuts) {
        onReorderShortcuts(updated);
      }
      setFeedbackMessage('Tray application order changed!');
    }

    setDraggingShortcutId(null);
    setDragOverShortcutId(null);
  };

  const handleShortcutDragEnd = () => {
    setDraggingShortcutId(null);
    setDragOverShortcutId(null);
  };

  // Auto-clear feedback toast
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(''), 3000);
      return () => clearInterval(timer);
    }
  }, [feedbackMessage]);

  // Start modifying an existing popular web app
  const handleStartEditPopularApp = (app: PopularWebApp, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setEditingPopularAppId(app.id);
    setTitle(app.name);
    setUrl(app.url);
    setTargetDestination('popular');
    setActiveCatalogTab('popular');
    setShowAddAppModal(true);
    setValidationError('');
  };

  // Delete an app from Popular Web Apps
  const handleDeletePopularApp = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPopularApps(prev => prev.filter(app => app.id !== id));
    if (editingPopularAppId === id) {
      setEditingPopularAppId(null);
      setTitle('');
      setUrl('');
      setShowAddAppModal(false);
    }
    setFeedbackMessage('App removed from Popular Web Apps');
  };

  // Pin / Add from catalog to main Applications tray panel
  const handlePinToPanel = (app: { id: string; name: string; url: string }, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onAddShortcut({
      title: app.name,
      url: app.url,
      iconName: app.id,
      color: 'transparent'
    });
    setFeedbackMessage(`Added ${app.name} to Applications tray!`);
  };

  // Handle Form Submit: Add or Modify from the modal popup
  const handleModalFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim() && !url.trim()) {
      setValidationError('Please enter a website URL or app name.');
      return;
    }

    let destUrl = url.trim();
    if (!destUrl && title.trim()) {
      destUrl = `https://${title.trim().toLowerCase().replace(/\s+/g, '')}.com`;
    } else if (!/^https?:\/\//i.test(destUrl)) {
      destUrl = 'https://' + destUrl;
    }

    const appTitle = title.trim() || extractDomain(destUrl);
    const detectedKey = resolveAppKey('', appTitle, destUrl);

    if (editingPopularAppId) {
      // Modify existing Popular Web App
      setPopularApps(prev => prev.map(app => 
        app.id === editingPopularAppId 
          ? { ...app, name: appTitle, url: destUrl, id: detectedKey || app.id } 
          : app
      ));
      setFeedbackMessage(`Updated ${appTitle}!`);
      setEditingPopularAppId(null);
    } else {
      // Add new Popular Web App
      const newId = detectedKey || `pop-${Date.now()}`;
      const newApp: PopularWebApp = {
        id: newId,
        name: appTitle,
        url: destUrl,
        isCustom: true
      };
      setPopularApps(prev => [...prev.filter(a => a.id !== newId), newApp]);
      setFeedbackMessage(`Added ${appTitle} to app list!`);
    }
    setActiveCatalogTab('popular');

    setTitle('');
    setUrl('');
    setShowAddAppModal(false);
  };

  const handleCloseAddModal = () => {
    setShowAddAppModal(false);
    setEditingPopularAppId(null);
    setTitle('');
    setUrl('');
    setValidationError('');
  };

  // Preview logo computation for custom input
  const previewDomain = url ? extractDomain(url) : '';
  const previewTitle = title || previewDomain;

  return (
    <div 
      id="shortcuts-widget-card" 
      className="card-glass-panel border rounded-3xl p-5 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-white/30"
    >
      {/* Header for Applications */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <GoogleWaffleLogo className="w-4 h-4 text-zinc-300" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-300 font-sans">
            Applications
          </h3>
          {feedbackMessage && (
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-fade-in">
              {feedbackMessage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="shortcuts-manage-toggle"
            onClick={() => {
              const nextState = !isConfiguring;
              setIsConfiguring(nextState);
              setIsAdding(nextState);
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isConfiguring 
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent shadow' 
                : 'bg-white/60 dark:bg-white/5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-zinc-200/40 dark:border-white/5'
            }`}
            title="Manage Applications & Tray"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isAdding && (
          <motion.div
            id="add-shortcut-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 p-4 bg-white/40 dark:bg-zinc-950/50 border border-zinc-200/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-inner"
          >
            {/* Header of Form */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  Browse & Add Applications
                </h4>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingPopularAppId(null);
                }}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Catalog Selector Tabs & Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCatalogTab('popular')}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeCatalogTab === 'popular'
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Popular Web Apps ({popularApps.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCatalogTab('google')}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      activeCatalogTab === 'google'
                        ? 'bg-white/15 text-white border border-white/20'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Google Apps
                  </button>
                </div>
              </div>

              {/* Items Grid */}
              <div 
                id="shortcut-icon-selector" 
                className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 bg-white/40 dark:bg-white/[0.03] p-3 border border-zinc-200/50 dark:border-white/10 rounded-2xl max-h-56 overflow-y-auto scrollbar-thin"
              >
                {activeCatalogTab === 'popular' ? (
                  <>
                    {popularApps.map(app => {
                      const isDragging = draggingPopId === app.id;
                      const isOver = dragOverPopId === app.id && draggingPopId !== app.id;

                      return (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={(e) => handlePopDragStart(app.id, e)}
                          onDragOver={(e) => handlePopDragOver(app.id, e)}
                          onDrop={(e) => handlePopDrop(app.id, e)}
                          onDragEnd={handlePopDragEnd}
                          onClick={() => handlePinToPanel(app)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setContextMenu({
                              x: e.clientX,
                              y: e.clientY,
                              app
                            });
                          }}
                          className={`relative group/pop flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center cursor-pointer select-none ${
                            isDragging
                              ? 'opacity-40 scale-95 border-indigo-500 border-dashed bg-indigo-500/10'
                              : isOver
                              ? 'border-indigo-400 bg-indigo-500/25 scale-105 shadow-md ring-2 ring-indigo-400/50'
                              : editingPopularAppId === app.id
                              ? 'bg-indigo-500/20 border-indigo-400'
                              : 'border-transparent hover:border-indigo-500/30 hover:bg-white/10 active:scale-95'
                          }`}
                          title={`Click to add to tray • Right-click for options • Drag to reorder`}
                        >
                          {/* App Icon and Title Button - Sets directly into tray on left click */}
                          <div className="flex flex-col items-center gap-1.5 w-full pointer-events-none">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] group-hover/pop:scale-105 transition-transform">
                              <GoogleAppImage name={app.id} title={app.name} url={app.url} className="w-7 h-7" />
                            </div>
                            <span className="text-[11px] font-normal text-zinc-300 group-hover/pop:text-white truncate w-full">
                              {app.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* + Icon tile at the end of the popular apps list */}
                    <button
                      type="button"
                      id="add-custom-app-tile-btn"
                      onClick={() => {
                        setEditingPopularAppId(null);
                        setTitle('');
                        setUrl('');
                        setValidationError('');
                        setShowAddAppModal(true);
                      }}
                      className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-indigo-400/40 hover:border-indigo-400 hover:bg-indigo-500/15 transition-all cursor-pointer group text-center min-h-[76px]"
                      title="Add App to List: Enter Name & URL"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] group-hover:bg-indigo-500/20 text-indigo-400 group-hover:text-indigo-300 transition-all border border-indigo-500/20">
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[11px] font-medium text-indigo-300 group-hover:text-indigo-200 truncate w-full">
                        Add App
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    {GOOGLE_PRESET_APPS.map(app => (
                      <button
                        key={app.id}
                        type="button"
                        id={`picker-icon-${app.id}`}
                        onClick={() => handlePinToPanel(app)}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-transparent hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer group text-center"
                        title={`Pin ${app.name} with true logo`}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] group-hover:scale-105 transition-transform">
                          <GoogleAppImage name={app.id} title={app.name} url={app.url} className="w-7 h-7" />
                        </div>
                        <span className="text-[11px] font-normal text-zinc-300 group-hover:text-white truncate w-full">
                          {app.name}
                        </span>
                      </button>
                    ))}

                    {/* + Icon in Google Apps tab as well */}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPopularAppId(null);
                        setTitle('');
                        setUrl('');
                        setValidationError('');
                        setShowAddAppModal(true);
                      }}
                      className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border border-dashed border-indigo-400/40 hover:border-indigo-400 hover:bg-indigo-500/15 transition-all cursor-pointer group text-center min-h-[76px]"
                      title="Add Custom App: Enter Name & URL"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] group-hover:bg-indigo-500/20 text-indigo-400 group-hover:text-indigo-300 transition-all border border-indigo-500/20">
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[11px] font-medium text-indigo-300 group-hover:text-indigo-200 truncate w-full">
                        Add Custom
                      </span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Launcher Application Shortcuts */}
      <div 
        id="shortcuts-items-grid" 
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-y-6 gap-x-3 py-2"
      >
        {shortcuts.map((shortcut) => {
          const isDragging = draggingShortcutId === shortcut.id;
          const isOver = dragOverShortcutId === shortcut.id && draggingShortcutId !== shortcut.id;

          return (
            <div 
              key={shortcut.id} 
              id={`shortcut-wrapper-${shortcut.id}`}
              draggable
              onDragStart={(e) => handleShortcutDragStart(shortcut.id, e)}
              onDragOver={(e) => handleShortcutDragOver(shortcut.id, e)}
              onDrop={(e) => handleShortcutDrop(shortcut.id, e)}
              onDragEnd={handleShortcutDragEnd}
              className={`relative group flex flex-col items-center transition-all duration-200 cursor-grab active:cursor-grabbing ${
                isDragging 
                  ? 'opacity-30 scale-90' 
                  : isOver 
                  ? 'scale-110 ring-2 ring-indigo-400/80 rounded-2xl bg-indigo-500/10' 
                  : ''
              }`}
            >
              <a
                href={shortcut.url}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => {
                  // Prevent accidental open during a drag action
                  if (draggingShortcutId) {
                    e.preventDefault();
                  }
                }}
                className="flex flex-col items-center gap-2 w-full text-center transition-all duration-200 hover:scale-[1.08] active:scale-95"
              >
                {/* Icon Container matching reference image */}
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 bg-white/[0.04] group-hover:bg-white/[0.1] border border-white/5 group-hover:border-white/20 shadow-sm group-hover:shadow-lg relative"
                >
                  {getShortcutLogo(shortcut)}
                  {/* Subtle drag grip handle on hover or during config */}
                  {isConfiguring && (
                    <div className="absolute top-1 left-1 text-zinc-400 opacity-60">
                      <GripVertical className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-normal text-zinc-300 group-hover:text-white transition-colors truncate w-full px-1 text-center select-none">
                  {shortcut.title}
                </span>
              </a>

            {/* Quick action badges during edit modes */}
            <AnimatePresence>
              {isConfiguring && (
                <motion.button
                  id={`delete-shortcut-btn-${shortcut.id}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteShortcut(shortcut.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md z-30 cursor-pointer"
                  title="Remove App"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </motion.button>
              )}
            </AnimatePresence>
            </div>
          );
        })}

        {shortcuts.length === 0 && (
          <div className="col-span-full py-6 text-center text-xs text-zinc-400 font-mono">
            No applications configured in tray. Click the settings gear icon above to add apps.
          </div>
        )}
      </div>

      {/* Right-Click Context Menu for Popular Web Apps */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: 'fixed',
              left: Math.min(contextMenu.x, window.innerWidth - 200),
              top: Math.min(contextMenu.y, window.innerHeight - 180),
              zIndex: 9999,
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-48 bg-zinc-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 shadow-2xl text-xs text-zinc-200"
          >
            {/* Header info */}
            <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center">
                <GoogleAppImage name={contextMenu.app.id} title={contextMenu.app.name} url={contextMenu.app.url} className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white truncate text-[11px]">{contextMenu.app.name}</span>
            </div>

            {/* Menu Items */}
            <button
              type="button"
              onClick={() => {
                handlePinToPanel(contextMenu.app);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer text-[11px]"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add to Tray</span>
            </button>

            <a
              href={contextMenu.app.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => setContextMenu(null)}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer text-[11px]"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open in New Tab</span>
            </a>

            <button
              type="button"
              onClick={() => {
                handleStartEditPopularApp(contextMenu.app);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer text-[11px]"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Modify App</span>
            </button>

            <div className="my-1 border-t border-white/5" />

            <button
              type="button"
              onClick={() => {
                handleDeletePopularApp(contextMenu.app.id);
                setContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-red-500/15 text-red-400 text-left transition-colors cursor-pointer text-[11px]"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Popular Apps</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / Modify Web App Modal Dialog (when + icon is pressed) */}
      <AnimatePresence>
        {showAddAppModal && (
          <div 
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={handleCloseAddModal}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="card-glass-panel border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl relative bg-zinc-950/95"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-sans">
                      {editingPopularAppId ? 'Modify Web App' : 'Add Web App'}
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      Type the name and URL to fill it into your app list
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Live Logo Preview Box */}
              {(url || title) && (
                <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                    <GoogleAppImage name="" title={previewTitle} url={url} className="w-7 h-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-white truncate">
                      {previewTitle || 'New App'}
                    </span>
                    <span className="block text-[10px] text-zinc-400 truncate font-mono">
                      {url ? (url.startsWith('http') ? url : `https://${url}`) : 'Enter URL below'}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleModalFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="modal-app-name-input" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    App Name
                  </label>
                  <input
                    id="modal-app-name-input"
                    type="text"
                    autoFocus
                    placeholder="e.g. Discord, Twitch, Figma, Notion"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 text-white placeholder-zinc-500"
                  />
                </div>

                <div>
                  <label htmlFor="modal-app-url-input" className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      id="modal-app-url-input"
                      type="text"
                      placeholder="e.g. discord.com or https://discord.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full text-xs pl-9 pr-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 text-white placeholder-zinc-500 font-mono"
                    />
                  </div>
                </div>

                {validationError && (
                  <p className="text-[11px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                    {validationError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 text-zinc-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    id="modal-app-submit-btn"
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingPopularAppId ? 'Save Changes' : 'Add to List'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

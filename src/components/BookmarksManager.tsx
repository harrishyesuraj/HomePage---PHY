import React, { useState, useRef, useMemo } from 'react';
import { 
  Plus, Bookmark, Trash2, Tag, ExternalLink, Filter, FolderPlus, X, 
  Download, Upload, FileUp, Check, AlertCircle, FileText, Folder,
  ChevronRight, ArrowLeft, CheckSquare, Square, Edit3, AlertTriangle, Layers
} from 'lucide-react';
import { Bookmark as BookmarkType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BookmarksManagerProps {
  bookmarks: BookmarkType[];
  onAddBookmark: (title: string, url: string, category: string, folder?: string) => void;
  onDeleteBookmark: (id: string) => void;
  onDeleteMultipleBookmarks?: (ids: string[]) => void;
  onDeleteAllBookmarks?: () => void;
  onRenameCategory?: (oldCategory: string, newCategory: string) => void;
  onRenameFolder?: (category: string, oldFolder: string, newFolder: string) => void;
  onDeleteFolder?: (category: string, folder: string) => void;
  onImportBookmarks?: (imported: BookmarkType[]) => void;
}

const DEFAULT_CATEGORIES = ['Dev', 'Work', 'Entertainment', 'Social', 'News'];

// Helper to extract clean domain title if none provided
function getDomainName(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export default function BookmarksManager({ 
  bookmarks, 
  onAddBookmark, 
  onDeleteBookmark,
  onDeleteMultipleBookmarks,
  onDeleteAllBookmarks,
  onRenameCategory,
  onRenameFolder,
  onDeleteFolder,
  onImportBookmarks
}: BookmarksManagerProps) {
  // Navigation State
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  // UI Modes
  const [isAdding, setIsAdding] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals & Confirmation dialogs
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showRenameCategoryModal, setShowRenameCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [formCategory, setFormCategory] = useState('Dev');
  const [formFolder, setFormFolder] = useState('');
  const [validationError, setValidationError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Import State
  const [pendingImportList, setPendingImportList] = useState<BookmarkType[]>([]);
  const [importSummary, setImportSummary] = useState<{ count: number; categories: number; folders: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setFeedback = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  // Derive dynamic list of categories from bookmarks and defaults
  const allCategories = useMemo(() => {
    const catSet = new Set<string>(DEFAULT_CATEGORIES);
    bookmarks.forEach(bm => {
      if (bm.category && bm.category.trim()) {
        catSet.add(bm.category.trim());
      }
    });
    return Array.from(catSet);
  }, [bookmarks]);

  // Derive available subfolders for active category
  const categoryFolders = useMemo(() => {
    if (activeCategory === 'All') return [];
    const folderMap = new Map<string, number>();
    bookmarks.forEach(bm => {
      if (bm.category === activeCategory && bm.folder && bm.folder.trim()) {
        const f = bm.folder.trim();
        folderMap.set(f, (folderMap.get(f) || 0) + 1);
      }
    });
    return Array.from(folderMap.entries()).map(([name, count]) => ({ name, count }));
  }, [bookmarks, activeCategory]);

  // Filtered bookmarks according to user requirements:
  // 1. In 'All': only show bookmarks that have NO subfolder (!bm.folder)
  // 2. In a specific category with activeFolder selected: show only bookmarks in that subfolder
  // 3. In a specific category without activeFolder: show direct bookmarks in that category (!bm.folder)
  const visibleBookmarks = useMemo(() => {
    if (activeCategory === 'All') {
      return bookmarks.filter(bm => !bm.folder);
    }
    if (activeFolder) {
      return bookmarks.filter(bm => bm.category === activeCategory && bm.folder === activeFolder);
    }
    // Category root: bookmarks directly in this category without subfolder
    return bookmarks.filter(bm => bm.category === activeCategory && !bm.folder);
  }, [bookmarks, activeCategory, activeFolder]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim() || !url.trim()) {
      setValidationError('Both Title and URL are required.');
      return;
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const assignedCategory = activeCategory === 'All' ? formCategory : activeCategory;
    const assignedFolder = activeFolder ? activeFolder : (formFolder.trim() || undefined);

    onAddBookmark(title.trim(), formattedUrl, assignedCategory, assignedFolder);
    setTitle('');
    setUrl('');
    setFormFolder('');
    setIsAdding(false);
    setFeedback(`Added "${title.trim()}"`);
  };

  // Multi-Select Handlers
  const toggleSelectBookmark = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    if (selectedIds.size === visibleBookmarks.length && visibleBookmarks.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleBookmarks.map(b => b.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    const count = selectedIds.size;
    if (onDeleteMultipleBookmarks) {
      onDeleteMultipleBookmarks(Array.from(selectedIds));
    } else {
      selectedIds.forEach(id => onDeleteBookmark(id));
    }
    setFeedback(`Deleted ${count} bookmark(s)`);
    setSelectedIds(new Set());
    setIsSelectMode(false);
  };

  const handleConfirmDeleteAll = () => {
    if (onDeleteAllBookmarks) {
      onDeleteAllBookmarks();
    } else {
      bookmarks.forEach(b => onDeleteBookmark(b.id));
    }
    setShowDeleteAllModal(false);
    setSelectedIds(new Set());
    setIsSelectMode(false);
    setFeedback('All bookmarks have been deleted.');
  };

  // Category Rename Handler
  const handleRenameCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || newCategoryName.trim() === activeCategory) {
      setShowRenameCategoryModal(false);
      return;
    }
    if (onRenameCategory) {
      onRenameCategory(activeCategory, newCategoryName.trim());
      setActiveCategory(newCategoryName.trim());
      setFeedback(`Category renamed to "${newCategoryName.trim()}"`);
    }
    setShowRenameCategoryModal(false);
  };

  // Create Subfolder in Active Category
  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || activeCategory === 'All') {
      setShowCreateFolderModal(false);
      return;
    }
    setActiveFolder(newFolderName.trim());
    setFeedback(`Entered new subfolder "${newFolderName.trim()}"`);
    setShowCreateFolderModal(false);
    setNewFolderName('');
  };

  // EXPORT BOOKMARKS TO JSON & HTML
  const handleExportJSON = () => {
    if (bookmarks.length === 0) {
      setFeedback('No bookmarks to export.');
      return;
    }
    const exportData = {
      version: 2,
      exportedAt: new Date().toISOString(),
      count: bookmarks.length,
      bookmarks: bookmarks
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `bookmarks-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    setFeedback(`Exported ${bookmarks.length} bookmarks as JSON`);
  };

  const handleExportHTML = () => {
    if (bookmarks.length === 0) {
      setFeedback('No bookmarks to export.');
      return;
    }
    // Group bookmarks by category and folder for standard Netscape export
    const categoriesMap = new Map<string, Map<string, BookmarkType[]>>();
    bookmarks.forEach(b => {
      const cat = b.category || 'Bookmarks';
      const fld = b.folder || '';
      if (!categoriesMap.has(cat)) {
        categoriesMap.set(cat, new Map());
      }
      const fldMap = categoriesMap.get(cat)!;
      if (!fldMap.has(fld)) {
        fldMap.set(fld, []);
      }
      fldMap.get(fld)!.push(b);
    });

    let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>\n<!-- This is an automatically generated file. -->\n<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n<TITLE>Bookmarks</TITLE>\n<H1>Bookmarks</H1>\n<DL><p>\n`;

    categoriesMap.forEach((foldersMap, catName) => {
      html += `    <DT><H3>${catName}</H3>\n    <DL><p>\n`;
      foldersMap.forEach((bms, fldName) => {
        if (fldName) {
          html += `        <DT><H3>${fldName}</H3>\n        <DL><p>\n`;
          bms.forEach(b => {
            html += `            <DT><A HREF="${b.url}" ADD_DATE="${Math.floor(b.createdAt / 1000)}">${b.title}</A>\n`;
          });
          html += `        </DL><p>\n`;
        } else {
          bms.forEach(b => {
            html += `        <DT><A HREF="${b.url}" ADD_DATE="${Math.floor(b.createdAt / 1000)}">${b.title}</A>\n`;
          });
        }
      });
      html += `    </DL><p>\n`;
    });

    html += `</DL><p>\n`;

    const blob = new Blob([html], { type: 'text/html' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `bookmarks-chrome-${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    setFeedback(`Exported ${bookmarks.length} bookmarks as Chrome HTML`);
  };

  // HIERARCHICAL CHROME BOOKMARKS PARSER
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const parsed: BookmarkType[] = [];
      const discoveredCategories = new Set<string>();
      const discoveredFolders = new Set<string>();

      // 1. Try parsing JSON format
      if (file.name.endsWith('.json') || content.trim().startsWith('{') || content.trim().startsWith('[')) {
        try {
          const json = JSON.parse(content);
          const rawList = Array.isArray(json) ? json : (json.bookmarks || []);
          rawList.forEach((item: any, idx: number) => {
            if (item.url) {
              const cat = item.category || 'Imported';
              const fld = item.folder || undefined;
              discoveredCategories.add(cat);
              if (fld) discoveredFolders.add(fld);
              parsed.push({
                id: item.id || `import-${Date.now()}-${idx}`,
                title: item.title || item.name || getDomainName(item.url),
                url: item.url.startsWith('http') ? item.url : `https://${item.url}`,
                category: cat,
                folder: fld,
                createdAt: item.createdAt || Date.now()
              });
            }
          });
        } catch {}
      }

      // 2. Netscape HTML format (Chrome / Firefox / Safari Bookmark Export)
      if (parsed.length === 0 && (file.name.endsWith('.html') || file.name.endsWith('.htm') || content.includes('<A HREF='))) {
        try {
          const domParser = new DOMParser();
          const doc = domParser.parseFromString(content, 'text/html');

          // Recursive traverse through DL and DT nodes preserving folders & subfolders
          const traverseNode = (container: Element, currentCategory: string, folderStack: string[]) => {
            const dts = container.querySelectorAll(':scope > DT');
            dts.forEach((dt, idx) => {
              const h3 = dt.querySelector(':scope > H3');
              const a = dt.querySelector(':scope > A');
              const dl = dt.querySelector(':scope > DL');

              if (h3 && dl) {
                const folderTitle = (h3.textContent || '').trim();
                // Filter out standard root wrappers in Chrome export
                const isGenericRoot = ['bookmarks bar', 'other bookmarks', 'mobile bookmarks', 'bookmarks'].includes(folderTitle.toLowerCase());
                
                if (!currentCategory) {
                  if (isGenericRoot) {
                    // Traverse inside children without setting root name
                    traverseNode(dl, '', []);
                  } else {
                    // This folder becomes the Main Category!
                    discoveredCategories.add(folderTitle);
                    traverseNode(dl, folderTitle, []);
                  }
                } else {
                  // We already have a Category; this folder is a SUBFOLDER!
                  const newFolderStack = [...folderStack, folderTitle];
                  const folderPath = newFolderStack.join('/');
                  discoveredFolders.add(folderPath);
                  traverseNode(dl, currentCategory, newFolderStack);
                }
              } else if (a) {
                const rawUrl = a.getAttribute('HREF') || '';
                const rawTitle = (a.textContent || '').trim() || getDomainName(rawUrl);
                if (rawUrl && !rawUrl.startsWith('javascript:') && !rawUrl.startsWith('place:')) {
                  const cat = currentCategory || 'Imported';
                  const fld = folderStack.length > 0 ? folderStack.join('/') : undefined;
                  discoveredCategories.add(cat);
                  if (fld) discoveredFolders.add(fld);
                  parsed.push({
                    id: `import-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
                    title: rawTitle,
                    url: rawUrl,
                    category: cat,
                    folder: fld,
                    createdAt: Date.now()
                  });
                }
              }
            });
          };

          const rootDl = doc.querySelector('DL');
          if (rootDl) {
            traverseNode(rootDl, '', []);
          }
        } catch (err) {
          console.warn('DOM parser error, falling back to regex:', err);
        }

        // Fallback regex if DOMParser didn't pick up items
        if (parsed.length === 0) {
          const regex = /<A\s+HREF="([^"]+)"[^>]*>([^<]*)<\/A>/gi;
          let match;
          let idx = 0;
          while ((match = regex.exec(content)) !== null) {
            const rawUrl = match[1];
            const rawTitle = match[2] || getDomainName(rawUrl);
            if (rawUrl && !rawUrl.startsWith('javascript:') && !rawUrl.startsWith('place:')) {
              parsed.push({
                id: `import-${Date.now()}-${idx++}`,
                title: rawTitle.trim(),
                url: rawUrl,
                category: 'Imported',
                createdAt: Date.now()
              });
            }
          }
        }
      }

      if (parsed.length > 0) {
        setPendingImportList(parsed);
        setImportSummary({
          count: parsed.length,
          categories: discoveredCategories.size || 1,
          folders: discoveredFolders.size
        });
      } else {
        setFeedback('No valid bookmarks could be found in the selected file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyImport = () => {
    if (pendingImportList.length === 0) return;
    if (onImportBookmarks) {
      onImportBookmarks(pendingImportList);
    } else {
      pendingImportList.forEach(item => onAddBookmark(item.title, item.url, item.category, item.folder));
    }
    setFeedback(`Imported ${pendingImportList.length} bookmarks with folder hierarchy!`);
    setIsImporting(false);
    setPendingImportList([]);
    setImportSummary(null);
  };

  return (
    <div 
      id="bookmarks-widget-card" 
      className="card-glass-panel border rounded-3xl p-5 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-white/30 h-full min-h-[460px] flex flex-col justify-between"
    >
      {/* Top Header Bar */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Bookmark className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-400 font-sans">
              Bookmarks
            </h3>
            {statusMessage && (
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full animate-fade-in">
                {statusMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Multi-Select Toggle Button */}
            <button
              id="select-bookmarks-mode-toggle"
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                setSelectedIds(new Set());
              }}
              className={`p-1.5 px-2 rounded-lg text-[10px] uppercase tracking-wider font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                isSelectMode
                  ? 'bg-indigo-600 text-white border-transparent shadow'
                  : 'bg-white/60 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-zinc-200/40 dark:border-white/5'
              }`}
              title="Multi-select Bookmarks"
            >
              <CheckSquare className="w-3 h-3" />
              <span className="hidden sm:inline">Select</span>
            </button>

            {/* Export Bookmarks Button */}
            <div className="relative group">
              <button
                id="export-bookmarks-button"
                onClick={handleExportJSON}
                className="p-1.5 px-2 rounded-lg text-[10px] uppercase tracking-wider font-semibold bg-white/60 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border border-zinc-200/40 dark:border-white/5 transition-colors cursor-pointer flex items-center gap-1"
                title="Export Bookmarks (Click JSON / Right click Chrome HTML)"
              >
                <Download className="w-3 h-3" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>

            {/* Import Bookmarks Button */}
            <button
              id="import-bookmarks-button"
              onClick={() => {
                setIsImporting(!isImporting);
                setIsAdding(false);
                setValidationError('');
                setPendingImportList([]);
                setImportSummary(null);
              }}
              className={`p-1.5 px-2 rounded-lg text-[10px] uppercase tracking-wider font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${
                isImporting 
                  ? 'bg-indigo-600 text-white border-transparent' 
                  : 'bg-white/60 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 border-zinc-200/40 dark:border-white/5'
              }`}
              title="Import Bookmarks from Chrome / HTML / JSON"
            >
              <Upload className="w-3 h-3" />
              <span className="hidden sm:inline">Import</span>
            </button>

            {/* Delete All Bookmarks Button */}
            <button
              id="delete-all-bookmarks-toggle-btn"
              onClick={() => setShowDeleteAllModal(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-zinc-200/40 dark:border-white/5 transition-colors cursor-pointer"
              title="Delete All Bookmarks"
            >
              <Trash2 className="w-3 h-3" />
            </button>

            {/* Add Link Button */}
            <button
              id="add-bookmark-button"
              onClick={() => {
                setIsAdding(!isAdding);
                setIsImporting(false);
                setIsSelectMode(false);
              }}
              className="p-1.5 px-2.5 rounded-lg text-[10px] uppercase tracking-wider font-semibold bg-white/60 dark:bg-white/5 text-zinc-500 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-400 border border-zinc-200/40 dark:border-white/5 transition-colors cursor-pointer flex items-center gap-1"
            >
              {isAdding ? (
                <>
                  <X className="w-3 h-3" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Multi-Selection Control Bar */}
        {isSelectMode && (
          <div 
            id="multi-select-action-bar" 
            className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2 mb-3 animate-in fade-in duration-200 text-xs"
          >
            <div className="flex items-center gap-2">
              <button
                id="select-all-visible-btn"
                onClick={handleSelectAllVisible}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white cursor-pointer font-medium"
              >
                {selectedIds.size === visibleBookmarks.length && visibleBookmarks.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-indigo-400" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-400" />
                )}
                <span>Select All ({visibleBookmarks.length})</span>
              </button>
              <span className="text-zinc-500">•</span>
              <span className="font-mono text-indigo-300">{selectedIds.size} selected</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="delete-selected-bookmarks-btn"
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0}
                className="flex items-center gap-1 px-2.5 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:pointer-events-none text-white rounded-lg font-semibold text-[11px] transition-colors cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Selected</span>
              </button>
              <button
                id="cancel-select-mode-btn"
                onClick={() => {
                  setIsSelectMode(false);
                  setSelectedIds(new Set());
                }}
                className="px-2 py-1 text-zinc-400 hover:text-zinc-200 text-[11px]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Hidden File Input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.html,.htm,.txt"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Categories Bar & Traversal Breadcrumbs */}
        <div className="mb-3 space-y-2">
          {/* Category Tabs */}
          <div id="bookmarks-categories-tabs" className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              id="category-tab-all"
              onClick={() => {
                setActiveCategory('All');
                setActiveFolder(null);
              }}
              className={`text-xs px-2.5 py-1 rounded-xl whitespace-nowrap transition-all font-medium cursor-pointer ${
                activeCategory === 'All'
                  ? 'bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 shadow-sm font-semibold'
                  : 'bg-white/40 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-white/10'
              }`}
            >
              All
            </button>

            {allCategories.map(cat => (
              <button
                key={cat}
                id={`category-tab-${cat}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setActiveFolder(null);
                }}
                className={`text-xs px-2.5 py-1 rounded-xl whitespace-nowrap transition-all font-medium cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-zinc-800 dark:bg-white text-white dark:text-zinc-900 shadow-sm font-semibold'
                    : 'bg-white/40 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:bg-white/60 dark:hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* Rename Category action when active */}
            {activeCategory !== 'All' && (
              <button
                id="rename-active-category-btn"
                onClick={() => {
                  setNewCategoryName(activeCategory);
                  setShowRenameCategoryModal(true);
                }}
                className="p-1 text-zinc-400 hover:text-indigo-400 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title={`Rename Category "${activeCategory}"`}
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subfolders Navigation Bar (inside selected category) */}
          {activeCategory !== 'All' && (
            <div id="category-folder-traversal-bar" className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {/* Back to category root if drilled into folder */}
              {activeFolder ? (
                <div className="flex items-center gap-1.5 text-xs bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-xl w-full justify-between">
                  <div className="flex items-center gap-1 text-indigo-300">
                    <button
                      onClick={() => setActiveFolder(null)}
                      className="hover:underline flex items-center gap-1 text-zinc-300 hover:text-white"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>{activeCategory}</span>
                    </button>
                    <ChevronRight className="w-3 h-3 text-zinc-500" />
                    <span className="font-semibold text-white flex items-center gap-1">
                      <Folder className="w-3 h-3 text-indigo-400 fill-indigo-400/30" />
                      {activeFolder}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveFolder(null)}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200"
                  >
                    View All {activeCategory}
                  </button>
                </div>
              ) : (
                categoryFolders.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap w-full">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                      <Folder className="w-3 h-3 text-zinc-400" />
                      Subfolders:
                    </span>
                    {categoryFolders.map(f => (
                      <button
                        key={f.name}
                        onClick={() => setActiveFolder(f.name)}
                        className="text-[11px] flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/40 dark:bg-white/5 hover:bg-indigo-500/15 border border-zinc-200/40 dark:border-white/5 text-zinc-300 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer"
                      >
                        <Folder className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                        <span>{f.name}</span>
                        <span className="text-[9px] font-mono opacity-60">({f.count})</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setShowCreateFolderModal(true)}
                      className="text-[10px] flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-indigo-400 hover:bg-indigo-500/10 cursor-pointer"
                      title="New Folder"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Folder</span>
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* IMPORT DRAWER / MODAL */}
        <AnimatePresence>
          {isImporting && (
            <motion.div
              id="import-bookmarks-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4 bg-zinc-900/90 dark:bg-black/60 border border-indigo-500/30 rounded-2xl p-4 shadow-xl text-xs"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <FileUp className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-white">Import Chrome Bookmarks & Folders</span>
                </div>
                <button 
                  onClick={() => setIsImporting(false)} 
                  className="text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-indigo-500/[0.05] mb-3"
              >
                <Upload className="w-6 h-6 text-indigo-400 mx-auto mb-1.5" />
                <p className="text-zinc-200 font-medium">Click to select Chrome bookmarks export file</p>
                <p className="text-[10px] text-zinc-500 mt-1">Accepts <span className="font-mono text-zinc-400">bookmarks.html</span> from Chrome or JSON backup. Folders and subfolders are automatically mapped!</p>
              </div>

              {importSummary && (
                <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3 mb-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Parsed {importSummary.count} Bookmarks Ready to Import!</span>
                  </div>
                  <div className="text-[11px] text-zinc-300 space-y-0.5 font-mono">
                    <p>• {importSummary.categories} Categories discovered (e.g. Work, Dev, Personal)</p>
                    <p>• {importSummary.folders} Subfolders organized and preserved</p>
                  </div>
                  <button
                    id="apply-import-btn"
                    onClick={handleApplyImport}
                    className="w-full mt-2.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm & Import {importSummary.count} Bookmarks</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span>Or export current bookmarks:</span>
                <div className="flex items-center gap-2">
                  <button onClick={handleExportHTML} className="hover:text-white underline">Download as HTML</button>
                  <span>•</span>
                  <button onClick={handleExportJSON} className="hover:text-white underline">Download as JSON</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ADD BOOKMARK FORM DRAWER */}
        <AnimatePresence>
          {isAdding && (
            <motion.form 
              id="add-bookmark-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="overflow-hidden mb-4 bg-zinc-900/60 dark:bg-black/50 border border-zinc-200/50 dark:border-white/10 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                  <span>New Bookmark</span>
                  {activeCategory !== 'All' && (
                    <span className="text-[10px] text-indigo-400 font-mono">
                      Target: {activeCategory} {activeFolder ? `> ${activeFolder}` : ''}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    id="bookmark-form-title"
                    type="text"
                    placeholder="Bookmark Title (e.g. GitHub)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xs px-3 py-2 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                  />
                  <input
                    id="bookmark-form-url"
                    type="text"
                    placeholder="URL (e.g. github.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-xs px-3 py-2 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Category select if in 'All' view */}
                  {activeCategory === 'All' ? (
                    <div>
                      <label className="text-[10px] text-zinc-400 mb-1 block">Category</label>
                      <select
                        id="bookmark-form-category-select"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white/40 dark:bg-zinc-900 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 text-zinc-800 dark:text-zinc-100"
                      >
                        {allCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="text-[10px] text-zinc-400 mb-1 block">Subfolder (Optional)</label>
                      <input
                        type="text"
                        placeholder="Subfolder name (optional)"
                        value={activeFolder || formFolder}
                        onChange={(e) => setFormFolder(e.target.value)}
                        disabled={!!activeFolder}
                        className="w-full text-xs px-3 py-2 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 disabled:opacity-60"
                      />
                    </div>
                  )}

                  <div className="flex items-end">
                    <button
                      id="bookmark-form-submit-btn"
                      type="submit"
                      className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 font-semibold text-white rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Save Bookmark</span>
                    </button>
                  </div>
                </div>

                {validationError && (
                  <p className="text-[10px] font-mono text-red-400">{validationError}</p>
                )}
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Bookmarks List Container - scrollable & matching bento height */}
      <div 
        id="bookmarks-items-list" 
        className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin my-1"
      >
        {visibleBookmarks.length > 0 ? (
          visibleBookmarks.map((bookmark) => {
            const isSelected = selectedIds.has(bookmark.id);
            return (
              <div
                key={bookmark.id}
                id={`bookmark-item-${bookmark.id}`}
                className={`flex items-center justify-between p-2 rounded-xl transition-all border ${
                  isSelected
                    ? 'bg-indigo-500/15 border-indigo-500/40 text-white'
                    : 'bg-white/20 dark:bg-white/[0.03] hover:bg-white/40 dark:hover:bg-white/[0.07] border-zinc-200/30 dark:border-white/5 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Select Mode Checkbox */}
                  {isSelectMode && (
                    <button
                      onClick={() => toggleSelectBookmark(bookmark.id)}
                      className="text-zinc-400 hover:text-indigo-400 cursor-pointer flex-shrink-0"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4 text-zinc-500" />
                      )}
                    </button>
                  )}

                  <div className="w-6 h-6 rounded-lg bg-zinc-800/20 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${getDomainName(bookmark.url)}&sz=64`}
                      alt=""
                      className="w-3.5 h-3.5 object-contain"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:text-indigo-400 flex items-center gap-1.5 transition-colors flex-1"
                  >
                    <span className="text-xs font-medium truncate">{bookmark.title}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-40 hover:opacity-100 flex-shrink-0" />
                  </a>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  {/* Folder badge if in category view */}
                  {bookmark.folder && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-0.5">
                      <Folder className="w-2.5 h-2.5" />
                      {bookmark.folder}
                    </span>
                  )}

                  {/* Category tag */}
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 text-zinc-400">
                    {bookmark.category}
                  </span>

                  {/* Individual Delete Button */}
                  <button
                    id={`delete-bookmark-btn-${bookmark.id}`}
                    onClick={() => onDeleteBookmark(bookmark.id)}
                    className="p-1 text-zinc-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                    title="Delete Bookmark"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div id="bookmarks-empty-state" className="flex flex-col items-center justify-center py-12 text-center">
            <Bookmark className="w-8 h-8 text-zinc-400/40 mb-2 stroke-[1.5]" />
            <p className="text-xs font-semibold text-zinc-400">
              {activeFolder 
                ? `No bookmarks in subfolder "${activeFolder}"` 
                : activeCategory !== 'All' 
                  ? `No direct bookmarks in "${activeCategory}"` 
                  : 'No root bookmarks found'}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1 max-w-[220px]">
              {activeCategory === 'All' 
                ? 'Only root bookmarks appear here. Subfolder bookmarks are inside their respective category tabs.' 
                : 'Click "Add" above to create a bookmark in this area or import your browser bookmarks.'}
            </p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-3 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              Add Bookmark Here
            </button>
          </div>
        )}
      </div>

      {/* Footer Info Count */}
      <div className="pt-2 border-t border-zinc-200/30 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
        <span>
          Showing {visibleBookmarks.length} of {bookmarks.length} total bookmarks
        </span>
        {activeCategory !== 'All' && (
          <span>Category: {activeCategory} {activeFolder ? `(${activeFolder})` : ''}</span>
        )}
      </div>

      {/* CONFIRM DELETE ALL MODAL */}
      <AnimatePresence>
        {showDeleteAllModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-red-500/30 rounded-2xl p-5 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1.5">Delete All Bookmarks?</h4>
              <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                This will permanently remove all <span className="text-white font-mono font-semibold">{bookmarks.length}</span> bookmarks from your system. This action cannot be reversed.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDeleteAllModal(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-delete-all-bookmarks-btn"
                  onClick={handleConfirmDeleteAll}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer shadow"
                >
                  Yes, Delete All
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RENAME CATEGORY MODAL */}
      <AnimatePresence>
        {showRenameCategoryModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleRenameCategorySubmit}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-5 max-w-sm w-full shadow-2xl"
            >
              <h4 className="font-bold text-sm text-white mb-2">Rename Category "{activeCategory}"</h4>
              <p className="text-xs text-zinc-400 mb-3">
                All bookmarks in this category will be updated to the new name.
              </p>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                autoFocus
                placeholder="New Category Name"
                className="w-full text-xs px-3 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 mb-4"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRenameCategoryModal(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Save Name
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE SUBFOLDER MODAL */}
      <AnimatePresence>
        {showCreateFolderModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.form
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onSubmit={handleCreateFolderSubmit}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-5 max-w-sm w-full shadow-2xl"
            >
              <h4 className="font-bold text-sm text-white mb-2">New Folder in "{activeCategory}"</h4>
              <p className="text-xs text-zinc-400 mb-3">
                Enter a folder name to organize bookmarks inside this category.
              </p>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                placeholder="Folder Name (e.g. Projects, Tools)"
                className="w-full text-xs px-3 py-2 bg-zinc-800 border border-white/10 rounded-xl text-white outline-none focus:border-indigo-500 mb-4"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateFolderModal(false)}
                  className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

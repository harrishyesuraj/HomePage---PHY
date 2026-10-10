import React, { useState } from 'react';
import { 
  Plus, Bookmark, Trash2, Tag, ExternalLink, Filter, FolderPlus, X 
} from 'lucide-react';
import { Bookmark as BookmarkType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface BookmarksManagerProps {
  bookmarks: BookmarkType[];
  onAddBookmark: (title: string, url: string, category: string) => void;
  onDeleteBookmark: (id: string) => void;
}

const CATEGORIES = ['All', 'Work', 'Social', 'News', 'Dev', 'Entertainment'];

export default function BookmarksManager({ 
  bookmarks, 
  onAddBookmark, 
  onDeleteBookmark 
}: BookmarksManagerProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Dev');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim() || !url.trim()) {
      setValidationError('Both Title and URL are required.');
      return;
    }

    // Direct url prefix check
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    onAddBookmark(title.trim(), formattedUrl, category);
    setTitle('');
    setUrl('');
    setCategory('Dev');
    setIsAdding(false);
  };

  const filteredBookmarks = activeCategory === 'All' 
    ? bookmarks 
    : bookmarks.filter(b => b.category.toLowerCase() === activeCategory.toLowerCase());

  const getDomainName = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.hostname.replace('www.', '');
    } catch {
      return 'Web';
    }
  };

  return (
    <div 
      id="bookmarks-widget-card" 
      className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-zinc-300/50 dark:hover:border-white/15"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-zinc-450 dark:text-zinc-450">
          <Bookmark className="w-4 h-4 text-zinc-500 dark:text-zinc-450" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-sans">
            Bookmarks
          </h3>
        </div>

        <button
          id="add-bookmark-button"
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold py-1.5 px-2.5 rounded-lg bg-white/60 dark:bg-white/5 text-zinc-650 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/25 hover:text-indigo-600 dark:hover:text-indigo-300 border border-zinc-200/40 dark:border-white/5 transition-colors cursor-pointer"
        >
          {isAdding ? (
            <>
              <X className="w-3 h-3" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              <span>Add Link</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding && (
          <motion.form 
            id="add-bookmark-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="mb-4 p-3 bg-white/30 dark:bg-zinc-950/20 border border-zinc-200/30 dark:border-white/5 rounded-2xl overflow-hidden"
          >
            <h4 className="text-[11px] font-semibold text-zinc-450 dark:text-zinc-400 uppercase tracking-wider mb-2.5">
              Add New Bookmark
            </h4>
            <div className="space-y-2 text-zinc-805">
              <div>
                <input
                  id="bookmark-form-title"
                  type="text"
                  placeholder="Title (e.g. YouTube)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                />
              </div>
              <div>
                <input
                  id="bookmark-form-url"
                  type="text"
                  placeholder="URL (e.g. youtube.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label htmlFor="bookmark-form-category" className="text-[10px] font-mono text-zinc-400 select-none">
                  Category:
                </label>
                <select
                  id="bookmark-form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 text-xs px-2 py-1.5 bg-white/50 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 outline-none"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  id="bookmark-form-submit-btn"
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-500 dark:bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-600 dark:hover:bg-indigo-550 transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
              {validationError && (
                <p className="text-[10px] text-red-500 font-mono mt-1">{validationError}</p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Category Tabs */}
      <div id="bookmark-category-filters" className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            id={`filter-bookmark-tab-${cat.toLowerCase()}`}
            onClick={() => setActiveCategory(cat)}
            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all pointer-events-auto cursor-pointer flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent font-bold'
                : 'bg-white/55 dark:bg-white/5 border-zinc-200/40 dark:border-white/5 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bookmarks List */}
      <div id="bookmarks-grid-list" className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredBookmarks.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400 font-mono">
            No bookmarks found in this category.
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div 
              key={bookmark.id} 
              id={`bookmark-item-${bookmark.id}`}
              className="group flex items-center justify-between p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850/50 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800/40 transition-all duration-200"
            >
              <a
                href={bookmark.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                {/* Domain Custom Favicon */}
                <div className="w-7 h-7 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 flex items-center justify-center overflow-hidden flex-shrink-0 border border-zinc-200/50 dark:border-zinc-700/50">
                  <img
                    src={`https://www.google.com/s2/favicons?sz=64&domain=${bookmark.url}`}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
                    }}
                    referrerPolicy="no-referrer"
                    className="w-4 h-4 object-contain rounded"
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-indigo-500 transition-colors">
                      {bookmark.title}
                    </span>
                    <ExternalLink className="w-2.5 h-2.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 block truncate">
                    {getDomainName(bookmark.url)}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-1 bg-transparent pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Badge Category */}
                <span className="text-[8px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-850 text-zinc-455">
                  {bookmark.category}
                </span>
                
                <button
                  id={`delete-bookmark-btn-${bookmark.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteBookmark(bookmark.id);
                  }}
                  className="p-1 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                  title="Remove Bookmark"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

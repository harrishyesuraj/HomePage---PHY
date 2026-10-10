import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Github, Compass } from 'lucide-react';
import { AppSettings, Bookmark } from '../types';

interface SearchBarProps {
  settings: AppSettings;
  bookmarks: Bookmark[];
  onUpdateProvider: (provider: AppSettings['searchProvider']) => void;
  isFocusedExternally?: boolean;
  onFocusedStateChange?: (focused: boolean) => void;
}

const PROVIDERS = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=', color: 'text-blue-500' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', color: 'text-orange-500' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=', color: 'text-teal-500' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/search?q=', color: 'text-zinc-400' },
] as const;

export default function SearchBar({
  settings,
  bookmarks,
  onUpdateProvider,
  isFocusedExternally = false,
  onFocusedStateChange,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus management
  useEffect(() => {
    if (isFocusedExternally && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isFocusedExternally]);

  // Keyboard shortcut for focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search bar on '/' or 's' when not in editable inputs
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      );

      if (!isInput) {
        if (e.key === '/' || e.key === 's' || e.key === 'S') {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update suggestions dynamically
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const trimmed = query.toLowerCase();
    
    // Find matching bookmarks
    const matchingBookmarks = bookmarks
      .filter(b => b.title.toLowerCase().includes(trimmed) || b.url.toLowerCase().includes(trimmed))
      .map(b => b.title)
      .slice(0, 3);

    // Dynamic standard completions based on developers query prefixes
    const prefixes = ['react', 'tailwindcss', 'javascript', 'typescript', 'vite', 'github', 'mdn', 'nextjs', 'stackoverflow', 'npm'];
    const prefixSuggestions = prefixes
      .filter(p => p.startsWith(trimmed) && !matchingBookmarks.includes(p))
      .map(p => p);

    const merged = Array.from(new Set([...matchingBookmarks, ...prefixSuggestions])).slice(0, 5);
    setSuggestions(merged);
  }, [query, bookmarks]);

  const activeProvider = PROVIDERS.find(p => p.id === settings.searchProvider) || PROVIDERS[0];

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    // Check if the query is a valid URL directly
    let destination = searchQuery.trim();
    if (/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(destination)) {
      if (!/^https?:\/\//i.test(destination)) {
        destination = 'https://' + destination;
      }
      window.location.href = destination;
    } else {
      window.location.href = `${activeProvider.url}${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        setQuery(suggestions[selectedIndex]);
        handleSearch(suggestions[selectedIndex]);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      inputRef.current?.blur();
      setSuggestions([]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div id="search-bar-container" className="relative w-full max-w-2xl mx-auto z-40">
      <div 
        className={`flex items-center gap-3 px-4 py-3.5 bg-white/40 dark:bg-white/6 backdrop-blur-xl border rounded-2xl shadow-sm transition-all duration-300 ${
          isFocused 
            ? 'border-indigo-500/50 dark:border-indigo-400/50 ring-2 ring-indigo-500/10 dark:ring-indigo-400/15 shadow-lg scale-[1.01]' 
            : 'border-zinc-200/50 dark:border-white/10'
        }`}
      >
        <div className="flex items-center gap-2">
          {activeProvider.id === 'github' ? (
            <Github className={`w-5 h-5 ${activeProvider.color}`} />
          ) : activeProvider.id === 'google' ? (
            <Compass className={`w-5 h-5 ${activeProvider.color}`} />
          ) : (
            <Globe className={`w-5 h-5 ${activeProvider.color}`} />
          )}
          
          <select
            id="search-provider-selector"
            aria-label="Search Engine Provider"
            value={settings.searchProvider}
            onChange={(e) => onUpdateProvider(e.target.value as AppSettings['searchProvider'])}
            className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-transparent border-0 focus:ring-0 cursor-pointer pr-1"
          >
            {PROVIDERS.map(prov => (
              <option key={prov.id} value={prov.id} className="bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 uppercase text-xs">
                {prov.name}
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-px bg-zinc-200/50 dark:bg-white/15" />

        <div className="relative flex-1">
          <input
            id="search-input-field"
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              onFocusedStateChange?.(true);
            }}
            onBlur={() => {
              // Delay blur slightly to capture suggestion clicks
              setTimeout(() => {
                setIsFocused(false);
                onFocusedStateChange?.(false);
              }, 200);
            }}
            placeholder={`Search ${activeProvider.name} or type a URL...`}
            className="w-full text-base bg-transparent text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 border-0 outline-none p-0 focus:ring-0"
          />
        </div>

        <button
          id="search-submit-btn"
          onClick={() => handleSearch(query)}
          className="p-1 px-2.5 rounded-lg text-zinc-400 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-white/10 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Suggestion list overlay */}
      {isFocused && suggestions.length > 0 && (
        <div id="search-suggestions-overlay" className="absolute top-full left-0 right-0 mt-2 bg-white/70 dark:bg-zinc-950/40 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion}-${index}`}
              id={`search-suggestion-${index}`}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                index === selectedIndex
                  ? 'bg-zinc-100/80 dark:bg-white/10 text-zinc-900 dark:text-zinc-50'
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Subtle indicator hint */}
      {!isFocused && (
        <p className="text-center mt-2.5 text-[10px] text-zinc-400/80 dark:text-zinc-500/80 tracking-wide font-mono select-none">
          Press <span className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-500 select-none">/</span> or <span className="bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-500 select-none">S</span> to focus search
        </p>
      )}
    </div>
  );
}

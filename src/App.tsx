import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Moon, LayoutGrid, RotateCcw, Clock as ClockIcon, Keyboard, Eye, 
  EyeOff, Sliders, ChevronDown, Monitor, Sparkles, Settings2, Trash2,
  Image as ImageIcon, Droplets, Palette
} from 'lucide-react';
import { Note, Bookmark, QuickShortcut, AppSettings, WidgetVisibility, WallpaperConfig, GlassEffectConfig } from './types';
import SearchBar from './components/SearchBar';
import WeatherWidget from './components/WeatherWidget';
import BookmarksManager from './components/BookmarksManager';
import PersonalNotesWidget from './components/PersonalNotesWidget';
import ApplicationShortcuts from './components/ApplicationShortcuts';
import HelpOverlays from './components/HelpOverlays';
import GeneralSettingsModal from './components/GeneralSettingsModal';
import { DEFAULT_WALLPAPER, DEFAULT_GLASS } from './data/wallpapers';
import { resolveAppKey } from './components/BrandLogos';

// Initial preloaded mock data to look full and beautiful instantly
const INITIAL_BOOKMARKS: Bookmark[] = [
  { id: 'bm-1', title: 'GitHub Repo', url: 'https://github.com', category: 'Dev', createdAt: 1717280000000 },
  { id: 'bm-2', title: 'YouTube Learn', url: 'https://youtube.com', category: 'Entertainment', createdAt: 1717281000000 },
  { id: 'bm-3', title: 'StackOverflow', url: 'https://stackoverflow.com', category: 'Dev', createdAt: 1717282000000 },
  { id: 'bm-4', title: 'Google Mail', url: 'https://mail.google.com', category: 'Work', createdAt: 1717283000000 },
  { id: 'bm-5', title: 'Vite Ecosystem', url: 'https://vite.dev', category: 'Dev', createdAt: 1717284000000 },
  { id: 'bm-6', title: 'Reddit Community', url: 'https://reddit.com', category: 'Social', createdAt: 1717285000000 },
];

const INITIAL_SHORTCUTS: QuickShortcut[] = [
  { id: 'sc-1', title: 'Account', url: 'https://myaccount.google.com', iconName: 'account', color: 'transparent' },
  { id: 'sc-2', title: 'Drive', url: 'https://drive.google.com', iconName: 'drive', color: 'transparent' },
  { id: 'sc-3', title: 'Gmail', url: 'https://mail.google.com', iconName: 'gmail', color: 'transparent' },
  { id: 'sc-4', title: 'YouTube', url: 'https://youtube.com', iconName: 'youtube', color: 'transparent' },
  { id: 'sc-5', title: 'Gemini', url: 'https://gemini.google.com', iconName: 'gemini', color: 'transparent' },
  { id: 'sc-6', title: 'Maps', url: 'https://maps.google.com', iconName: 'maps', color: 'transparent' },
  { id: 'sc-7', title: 'Search', url: 'https://google.com', iconName: 'search', color: 'transparent' },
  { id: 'sc-8', title: 'Calendar', url: 'https://calendar.google.com', iconName: 'calendar', color: 'transparent' },
  { id: 'sc-9', title: 'News', url: 'https://news.google.com', iconName: 'news', color: 'transparent' },
  { id: 'sc-10', title: 'Photos', url: 'https://photos.google.com', iconName: 'photos', color: 'transparent' },
  { id: 'sc-11', title: 'Meet', url: 'https://meet.google.com', iconName: 'meet', color: 'transparent' },
  { id: 'sc-12', title: 'Translate', url: 'https://translate.google.com', iconName: 'translate', color: 'transparent' },
];

const INITIAL_NOTES: Note[] = [
  { 
    id: 'n-1', 
    title: 'Daily Checklist 📋', 
    content: `- Review task pull requests on GitHub\n- Catch up with Javascript tech news\n- Backup custom web shortcuts config\n- Practice hydration breaks\n- Draft local markdown thoughts here!`, 
    updatedAt: Date.now(),
    isPinned: true
  },
  {
    id: 'n-2',
    title: 'Developer Links 🔗',
    content: `Vite Build config:
npm run dev
esbuild server setup

Tailwind Docs:
- @theme variables configuration
- Tailwind v4 inline imports`,
    updatedAt: Date.now() - 3600000
  }
];

export default function App() {
  // Dark Mode - default to true for sleek black theme
  const [darkMode, setDarkMode] = useState(() => {
    const blackThemeMigrated = localStorage.getItem('homepage_black_bg_migrated');
    if (!blackThemeMigrated) {
      localStorage.setItem('homepage_black_bg_migrated', 'true');
      localStorage.setItem('homepage_dark_mode', 'true');
      return true;
    }
    const saved = localStorage.getItem('homepage_dark_mode');
    return saved === null ? true : saved === 'true';
  });

  // Settings
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('homepage_config_settings');
    let initialSettings: AppSettings = {
      accentColor: 'indigo',
      bgStyle: 'wallpaper',
      searchProvider: 'google',
      useCelsius: true,
      wallpaper: DEFAULT_WALLPAPER,
      glass: DEFAULT_GLASS,
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        initialSettings = { 
          ...initialSettings, 
          ...parsed,
          wallpaper: parsed.wallpaper || DEFAULT_WALLPAPER,
          glass: parsed.glass || DEFAULT_GLASS,
        };
      } catch {}
    }
    return initialSettings;
  });

  // Widgets Visibility
  const [widgets, setWidgets] = useState<WidgetVisibility>(() => {
    const saved = localStorage.getItem('homepage_widgets_visibility');
    return saved ? JSON.parse(saved) : {
      weather: true,
      bookmarks: true,
      notes: true,
      quickLinks: true,
      clock: true
    };
  });

  // Clock
  const [time, setTime] = useState(new Date());

  // Personal state stores
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('homepage_user_bookmarks');
    return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
  });

  const [shortcuts, setShortcuts] = useState<QuickShortcut[]>(() => {
    const migrated = localStorage.getItem('homepage_shortcuts_google_v4');
    if (!migrated) {
      localStorage.setItem('homepage_shortcuts_google_v4', 'true');
      const saved = localStorage.getItem('homepage_user_shortcuts');
      if (saved) {
        try {
          const parsed: QuickShortcut[] = JSON.parse(saved);
          const repaired = parsed.map(s => {
            if (s.iconName === 'search' && !s.url.includes('google.com/search') && s.url !== 'https://google.com') {
              return { ...s, iconName: resolveAppKey('', s.title, s.url) };
            }
            return s;
          });
          localStorage.setItem('homepage_user_shortcuts', JSON.stringify(repaired));
          return repaired;
        } catch {}
      }
      localStorage.setItem('homepage_user_shortcuts', JSON.stringify(INITIAL_SHORTCUTS));
      return INITIAL_SHORTCUTS;
    }
    const saved = localStorage.getItem('homepage_user_shortcuts');
    if (saved) {
      try {
        const parsed: QuickShortcut[] = JSON.parse(saved);
        return parsed.map(s => {
          if (s.iconName === 'search' && !s.url.includes('google.com/search') && s.url !== 'https://google.com') {
            return { ...s, iconName: resolveAppKey('', s.title, s.url) };
          }
          return s;
        });
      } catch {}
    }
    return INITIAL_SHORTCUTS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('homepage_user_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [showConfigSettingsPanel, setShowConfigSettingsPanel] = useState(false);
  const [isGeneralSettingsOpen, setIsGeneralSettingsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Keyboard shortcut ',' to open settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      );
      if (!isInput && e.key === ',') {
        e.preventDefault();
        setIsGeneralSettingsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Time ticks
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync dark class to layout
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('homepage_dark_mode', String(darkMode));
  }, [darkMode]);

  // Save states modifications
  useEffect(() => {
    localStorage.setItem('homepage_config_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('homepage_widgets_visibility', JSON.stringify(widgets));
  }, [widgets]);

  useEffect(() => {
    localStorage.setItem('homepage_user_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('homepage_user_shortcuts', JSON.stringify(shortcuts));
  }, [shortcuts]);

  // Fetch notes from backend disk on mount so notes are always there whenever user opens
  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.notes) && data.notes.length > 0) {
          setNotes(data.notes);
          localStorage.setItem('homepage_user_notes', JSON.stringify(data.notes));
        }
      })
      .catch(err => {
        console.warn('Backend notes fetch error, using local fallback:', err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('homepage_user_notes', JSON.stringify(notes));
    // Persist to backend server
    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    }).catch(err => {
      console.warn('Backend notes save error:', err);
    });
  }, [notes]);

  // Bookmarks handlers
  const handleAddBookmark = (title: string, url: string, category: string, folder?: string) => {
    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      title,
      url,
      category,
      folder: folder || undefined,
      createdAt: Date.now()
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const handleDeleteMultipleBookmarks = (ids: string[]) => {
    const idSet = new Set(ids);
    setBookmarks(prev => prev.filter(b => !idSet.has(b.id)));
  };

  const handleDeleteAllBookmarks = () => {
    setBookmarks([]);
  };

  const handleRenameCategory = (oldCategory: string, newCategory: string) => {
    if (!newCategory.trim() || oldCategory === newCategory) return;
    setBookmarks(prev => prev.map(b => b.category === oldCategory ? { ...b, category: newCategory.trim() } : b));
  };

  const handleRenameFolder = (category: string, oldFolder: string, newFolder: string) => {
    if (!newFolder.trim() || oldFolder === newFolder) return;
    setBookmarks(prev => prev.map(b => (b.category === category && b.folder === oldFolder) ? { ...b, folder: newFolder.trim() } : b));
  };

  const handleDeleteFolder = (category: string, folder: string) => {
    setBookmarks(prev => prev.filter(b => !(b.category === category && b.folder === folder)));
  };

  const handleImportBookmarks = (newBookmarks: Bookmark[]) => {
    setBookmarks(prev => {
      const existingUrls = new Set(prev.map(b => b.url.toLowerCase()));
      const filtered = newBookmarks.filter(b => !existingUrls.has(b.url.toLowerCase()));
      return [...filtered, ...prev];
    });
  };

  // Shortcuts handlers
  const handleAddShortcut = (shortcutItem: Omit<QuickShortcut, 'id'>) => {
    const newShortcut: QuickShortcut = {
      ...shortcutItem,
      id: `sc-${Date.now()}`
    };
    setShortcuts(prev => [...prev, newShortcut]);
  };

  const handleReorderShortcuts = (reordered: QuickShortcut[]) => {
    setShortcuts(reordered);
  };

  const handleUpdateShortcut = (id: string, updates: Partial<QuickShortcut>) => {
    setShortcuts(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const handleDeleteShortcut = (id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  };

  // Notes handlers
  const handleAddNote = (title: string, content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title,
      content,
      updatedAt: Date.now()
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const toggleWidget = (key: keyof WidgetVisibility) => {
    setWidgets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Dedicated Reset Handlers (Immune to browser iframe dialog blocking)
  const handleResetBookmarks = () => {
    setBookmarks(INITIAL_BOOKMARKS);
    localStorage.setItem('homepage_user_bookmarks', JSON.stringify(INITIAL_BOOKMARKS));
  };

  const handleClearAllBookmarks = () => {
    setBookmarks([]);
    localStorage.setItem('homepage_user_bookmarks', JSON.stringify([]));
  };

  const handleResetNotes = () => {
    setNotes(INITIAL_NOTES);
    localStorage.setItem('homepage_user_notes', JSON.stringify(INITIAL_NOTES));
    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: INITIAL_NOTES }),
    }).catch(err => console.warn('Failed to sync reset notes to server:', err));
  };

  const handleResetShortcuts = () => {
    setShortcuts(INITIAL_SHORTCUTS);
    localStorage.setItem('homepage_user_shortcuts', JSON.stringify(INITIAL_SHORTCUTS));
    localStorage.setItem('homepage_shortcuts_google_v4', 'true');
  };

  const handleResetPopularApps = () => {
    localStorage.removeItem('homepage_custom_popular_apps_v2');
    window.dispatchEvent(new Event('reset_popular_apps'));
  };

  const handleResetAppearance = () => {
    setSettings(prev => ({
      ...prev,
      accentColor: 'indigo',
      bgStyle: 'wallpaper',
      wallpaper: DEFAULT_WALLPAPER,
      glass: DEFAULT_GLASS,
    }));
    setDarkMode(true);
    localStorage.setItem('homepage_dark_mode', 'true');
  };

  const handleResetWidgets = () => {
    const defaultWidgets: WidgetVisibility = {
      weather: true,
      bookmarks: true,
      notes: true,
      quickLinks: true,
      clock: true,
    };
    setWidgets(defaultWidgets);
    setSettings(prev => ({
      ...prev,
      searchProvider: 'google',
      useCelsius: true,
    }));
    localStorage.setItem('homepage_widgets_visibility', JSON.stringify(defaultWidgets));
  };

  const handleMasterReset = () => {
    const defaultWidgets: WidgetVisibility = {
      weather: true,
      bookmarks: true,
      notes: true,
      quickLinks: true,
      clock: true,
    };
    const defaultSettings: AppSettings = {
      accentColor: 'indigo',
      bgStyle: 'wallpaper',
      searchProvider: 'google',
      useCelsius: true,
      wallpaper: DEFAULT_WALLPAPER,
      glass: DEFAULT_GLASS,
    };
    setBookmarks(INITIAL_BOOKMARKS);
    setShortcuts(INITIAL_SHORTCUTS);
    setNotes(INITIAL_NOTES);
    setWidgets(defaultWidgets);
    setSettings(defaultSettings);
    setDarkMode(true);

    localStorage.setItem('homepage_user_bookmarks', JSON.stringify(INITIAL_BOOKMARKS));
    localStorage.setItem('homepage_user_shortcuts', JSON.stringify(INITIAL_SHORTCUTS));
    localStorage.setItem('homepage_user_notes', JSON.stringify(INITIAL_NOTES));
    localStorage.setItem('homepage_widgets_visibility', JSON.stringify(defaultWidgets));
    localStorage.setItem('homepage_config_settings', JSON.stringify(defaultSettings));
    localStorage.setItem('homepage_dark_mode', 'true');
    localStorage.setItem('homepage_shortcuts_google_v4', 'true');
    handleResetPopularApps();

    fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: INITIAL_NOTES }),
    }).catch(err => console.warn('Failed to sync master reset notes:', err));
  };

  const currentWallpaper = settings.wallpaper || DEFAULT_WALLPAPER;
  const currentGlass = settings.glass || DEFAULT_GLASS;
  const cardTransparency = (currentGlass.transparency ?? 25) / 100;
  const cardBlurValue = 
    currentGlass.blur === 'none' ? 'none' :
    currentGlass.blur === 'sm' ? 'blur(8px)' :
    currentGlass.blur === 'md' ? 'blur(16px)' :
    currentGlass.blur === 'lg' ? 'blur(20px)' :
    currentGlass.blur === 'xl' ? 'blur(24px)' :
    currentGlass.blur === '2xl' ? 'blur(32px)' : 'blur(40px)';

  const cardBorderDark = currentGlass.borderGlow 
    ? 'rgba(255, 255, 255, 0.22)' 
    : 'rgba(255, 255, 255, 0.10)';
  const cardBorderLight = currentGlass.borderGlow 
    ? 'rgba(255, 255, 255, 0.65)' 
    : 'rgba(0, 0, 0, 0.08)';

  return (
    <div 
      id="homepage-main-container" 
      style={{
        '--card-glass-bg-dark': `rgba(8, 10, 16, ${cardTransparency})`,
        '--card-glass-bg-light': `rgba(255, 255, 255, ${Math.min(0.85, cardTransparency + 0.15)})`,
        '--card-glass-blur': cardBlurValue,
        '--card-glass-border': cardBorderDark,
        '--card-glass-border-light': cardBorderLight,
      } as React.CSSProperties}
      className="min-h-screen transition-colors duration-500 text-zinc-800 dark:text-zinc-100 font-sans flex flex-col relative pb-16 pt-6 px-4 md:px-8 overflow-hidden bg-black"
    >
      {/* Background Wallpaper Layer with Live Blur and Dimming */}
      <div 
        id="dashboard-wallpaper-layer"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {currentWallpaper.type === 'solid' ? (
          <div 
            className="absolute inset-0 transition-colors duration-700" 
            style={{ backgroundColor: currentWallpaper.value }}
          />
        ) : currentWallpaper.type === 'gradient' ? (
          <div 
            className="absolute inset-0 transition-all duration-700" 
            style={{ background: currentWallpaper.value }}
          />
        ) : (
          <div 
            className="absolute -inset-8 transition-all duration-700 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentWallpaper.value})`,
              filter: `blur(${currentWallpaper.blur ?? 0}px)`,
              transform: 'scale(1.05)',
            }}
          />
        )}

        {/* Dynamic dimming overlay to guarantee crystal clear text contrast */}
        <div 
          className="absolute inset-0 bg-black transition-opacity duration-500"
          style={{ opacity: (currentWallpaper.dim ?? 30) / 100 }}
        />
      </div>

      {/* Top Header controls */}
      <header id="dashboard-navbar-header" className="max-w-7xl w-full mx-auto flex items-center justify-end mb-6 z-30">
        <div className="flex items-center gap-2">
          {/* General Settings Button for the Whole Page */}
          <button
            id="general-settings-open-btn"
            onClick={() => setIsGeneralSettingsOpen(true)}
            className="p-2 rounded-xl card-glass-panel border flex items-center justify-center text-xs font-semibold select-none transition-all cursor-pointer z-30 text-zinc-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-[1.05] active:scale-[0.98] shadow-sm hover:border-white/30"
            title="General Settings"
            aria-label="General Settings"
          >
            <Sliders className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          </button>
        </div>
      </header>

      {/* Dynamic Preferences Settings Overlay Panel */}
      {showConfigSettingsPanel && (
        <section 
          id="preferences-config-panel" 
          className="max-w-7xl w-full mx-auto mb-8 bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/60 dark:border-white/10 p-5 rounded-3xl shadow-xl z-45 relative animate-in fade-in slide-in-from-top-4 duration-350"
        >
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-850 pb-3 mb-4">
            <h3 className="font-display font-bold text-sm text-zinc-850 dark:text-zinc-200">
              Dashboard Styling & Active Widgets
            </h3>
            <button 
              id="close-preferences-panel"
              onClick={() => setShowConfigSettingsPanel(false)}
              className="text-xs font-mono font-medium text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
            >
              [Close]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Widgets Toggle selectors */}
            <div>
              <p className="text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-451 dark:text-zinc-400 mb-2.5">
                Enabled Widgets
              </p>
              <div id="settings-widgets-toggles" className="space-y-1.5 text-zinc-650 dark:text-zinc-300">
                {Object.keys(widgets).map((key) => {
                  const val = widgets[key as keyof WidgetVisibility];
                  return (
                    <button
                      key={key}
                      id={`widget-toggle-btn-${key}`}
                      onClick={() => toggleWidget(key as keyof WidgetVisibility)}
                      className="w-full flex items-center justify-between text-xs font-medium py-1.5 px-3 rounded-lg border border-zinc-150/60 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850/40 cursor-pointer"
                    >
                      <span className="capitalize">{key === 'quickLinks' ? 'Quick Access Grid' : key}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wide">
                        {val ? (
                          <span className="text-emerald-500">✔ ON</span>
                        ) : (
                          <span className="text-zinc-450 dark:text-zinc-500">❌ OFF</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Dashboard Themes & Wallpaper */}
            <div>
              <p className="text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                Wallpaper & Frosted Blur
              </p>
              <button
                id="open-wallpaper-settings-quick"
                onClick={() => {
                  setShowConfigSettingsPanel(false);
                  setIsGeneralSettingsOpen(true);
                }}
                className="w-full p-3 rounded-2xl card-glass-panel border flex items-center justify-between shadow-sm hover:border-indigo-400/50 transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 bg-black shrink-0">
                    {currentWallpaper.type === 'solid' ? (
                      <div className="w-full h-full" style={{ backgroundColor: currentWallpaper.value }} />
                    ) : currentWallpaper.type === 'gradient' ? (
                      <div className="w-full h-full" style={{ background: currentWallpaper.value }} />
                    ) : (
                      <img src={currentWallpaper.value} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-zinc-200 group-hover:text-white truncate max-w-[130px]">
                      {currentWallpaper.name}
                    </span>
                    <span className="block text-[10px] text-indigo-400 font-mono">
                      {currentGlass.transparency}% Glass • {currentGlass.blur}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20 group-hover:bg-indigo-500/20">
                  Change
                </span>
              </button>

              {/* Accent Color Palettes */}
              <p className="text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-451 dark:text-zinc-400 mt-4 mb-2">
                Focus Accent Highlight
              </p>
              <div id="settings-accent-colors" className="flex items-center gap-2">
                {['indigo', 'emerald', 'violet', 'rose', 'amber'].map(color => (
                  <button
                    key={color}
                    id={`accent-config-btn-${color}`}
                    onClick={() => setSettings({ ...settings, accentColor: color })}
                    className={`w-6 h-6 rounded-full border-2 transition-transform capitalize ${
                      color === 'indigo' ? 'bg-indigo-500 border-indigo-200 dark:border-indigo-850' : ''
                    } ${
                      color === 'emerald' ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-850' : ''
                    } ${
                      color === 'violet' ? 'bg-violet-500 border-violet-200 dark:border-violet-850' : ''
                    } ${
                      color === 'rose' ? 'bg-rose-500 border-rose-200 dark:border-rose-850' : ''
                    } ${
                      color === 'amber' ? 'bg-amber-500 border-amber-200 dark:border-amber-850' : ''
                    } ${
                      settings.accentColor === color ? 'scale-115 ring-2 ring-zinc-500/50' : 'hover:scale-105'
                    }`}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Column 3: Backup Restore Actions */}
            <div>
              <p className="text-[11px] font-bold font-mono uppercase tracking-wider text-zinc-451 dark:text-zinc-400 mb-2.5">
                Dashboard Control Actions
              </p>
              <div className="space-y-2">
                <button
                  id="reset-raw-data-btn"
                  onClick={handleMasterReset}
                  className="w-full flex items-center gap-1.5 justify-center py-2 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore Factory Defaults</span>
                </button>
                <p className="text-[9px] text-zinc-400 font-mono leading-normal">
                  Note: Bookmarks and note details are persistency locked entirely locally in your current browser session standard sandbox environment.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container Layout */}
      <main id="main-dashboard-grid" className="max-w-7xl w-full mx-auto flex-1 flex flex-col justify-start">
        {/* Row A: Big Digital Clock & Display */}
        {widgets.clock && (
          <section id="banner-clock-section" className="text-center mb-8 select-none">
            <div className="font-display font-black text-6xl tracking-tighter flex justify-center items-baseline gap-1.5">
              <span className="clock-time-inverse font-mono tracking-tight drop-shadow-md">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
            </div>
            <p className="text-xs font-mono tracking-widest uppercase font-semibold clock-time-inverse opacity-90 mt-1.5">
              {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </section>
        )}

        {/* Row B: Prominent Search Engine */}
        <section id="search-box-section" className="mb-10">
          <SearchBar 
            settings={settings}
            bookmarks={bookmarks}
            onUpdateProvider={(provider) => setSettings({ ...settings, searchProvider: provider })}
            isFocusedExternally={searchFocused}
            onFocusedStateChange={(focused) => setSearchFocused(focused)}
          />
        </section>

        {/* Row C: High-Fidelity App grid Launcher Icon Panel */}
        {widgets.quickLinks && (
          <section id="app-grid-launcher-section" className="mb-8">
            <ApplicationShortcuts 
              shortcuts={shortcuts}
              onAddShortcut={handleAddShortcut}
              onUpdateShortcut={handleUpdateShortcut}
              onDeleteShortcut={handleDeleteShortcut}
              onReorderShortcuts={handleReorderShortcuts}
            />
          </section>
        )}

        {/* Row D: Dynamic Bento-inspired multi-column Widget grid */}
        <section id="bento-widgets-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Bento Slot 1: Live geocoded Open-Meteo Weather widget */}
          {widgets.weather && (
            <div id="weather-bento-card" className="lg:col-span-1 h-full flex flex-col">
              <WeatherWidget 
                settings={settings}
                onChangeSettings={(newS) => setSettings(newS)}
              />
            </div>
          )}

          {/* Bento Slot 2: Multi-pages Personal drafting Journal */}
          {widgets.notes && (
            <div id="notes-bento-card" className="lg:col-span-1 h-full flex flex-col">
              <PersonalNotesWidget 
                notes={notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>
          )}

          {/* Bento Slot 3: Bookmarks categorization Manager */}
          {widgets.bookmarks && (
            <div id="bookmarks-bento-card" className="lg:col-span-1 md:col-span-2 h-full flex flex-col">
              <BookmarksManager 
                bookmarks={bookmarks}
                onAddBookmark={handleAddBookmark}
                onDeleteBookmark={handleDeleteBookmark}
                onDeleteMultipleBookmarks={handleDeleteMultipleBookmarks}
                onDeleteAllBookmarks={handleDeleteAllBookmarks}
                onRenameCategory={handleRenameCategory}
                onRenameFolder={handleRenameFolder}
                onDeleteFolder={handleDeleteFolder}
                onImportBookmarks={handleImportBookmarks}
              />
            </div>
          )}
        </section>
      </main>

      {/* Global Shortcut listeners overlay HUD */}
      <HelpOverlays 
        onFocusSearch={() => setSearchFocused(true)}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
      />

      {/* General Settings Dialog for Whole Page & Wallpaper Customization */}
      <GeneralSettingsModal 
        isOpen={isGeneralSettingsOpen}
        onClose={() => setIsGeneralSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings(newSettings)}
        widgets={widgets}
        onToggleWidget={toggleWidget}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prev => !prev)}
        onResetDefaults={handleMasterReset}
        onMasterReset={handleMasterReset}
        onResetBookmarks={handleResetBookmarks}
        onClearAllBookmarks={handleClearAllBookmarks}
        onResetNotes={handleResetNotes}
        onResetShortcuts={handleResetShortcuts}
        onResetPopularApps={handleResetPopularApps}
        onResetAppearance={handleResetAppearance}
        onResetWidgets={handleResetWidgets}
      />
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, X, Settings, Sparkles, Globe, 
  ExternalLink, Check, RotateCcw, Pin
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

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('homepage_custom_popular_apps_v2', JSON.stringify(popularApps));
  }, [popularApps]);

  // Form input states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [targetDestination, setTargetDestination] = useState<'popular' | 'panel'>('popular');
  const [editingPopularAppId, setEditingPopularAppId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

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
    setIsAdding(true);
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
    }
    setFeedbackMessage('App removed from Popular Web Apps');
  };

  // Reset popular apps back to default
  const handleResetPopularApps = () => {
    if (confirm('Reset Popular Web Apps to the default list?')) {
      setPopularApps(DEFAULT_POPULAR_APPS);
      setEditingPopularAppId(null);
      setTitle('');
      setUrl('');
      setFeedbackMessage('Popular Web Apps reset to default');
    }
  };

  // Pin / Add from catalog to main Google Apps tray panel
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
    setFeedbackMessage(`Added ${app.name} to Google Apps tray!`);
  };

  // Handle Form Submit: Add or Modify
  const handleFormSubmit = (e: React.FormEvent) => {
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

    if (targetDestination === 'popular') {
      if (editingPopularAppId) {
        // Modify existing Popular Web App
        setPopularApps(prev => prev.map(app => 
          app.id === editingPopularAppId 
            ? { ...app, name: appTitle, url: destUrl, id: detectedKey || app.id } 
            : app
        ));
        setFeedbackMessage(`Updated ${appTitle} in Popular Web Apps!`);
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
        setPopularApps(prev => [newApp, ...prev.filter(a => a.id !== newId)]);
        setFeedbackMessage(`Added ${appTitle} to Popular Web Apps!`);
      }
      setActiveCatalogTab('popular');
    } else {
      // Add directly to main Google Apps panel
      onAddShortcut({
        title: appTitle,
        url: destUrl,
        iconName: detectedKey || 'custom',
        color: 'transparent'
      });
      setFeedbackMessage(`Added ${appTitle} to Google Apps panel!`);
    }

    setTitle('');
    setUrl('');
    setIsAdding(false);
  };

  const handleCancelEditing = () => {
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
      className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-zinc-300/50 dark:hover:border-white/15"
    >
      {/* Header for Google Apps */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <GoogleWaffleLogo className="w-4 h-4 text-zinc-300" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-300 font-sans">
            Google Apps
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
              setIsConfiguring(!isConfiguring);
              setIsAdding(false);
            }}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isConfiguring 
                ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 border-transparent shadow' 
                : 'bg-white/60 dark:bg-white/5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-zinc-200/40 dark:border-white/5'
            }`}
            title="Manage Apps"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {isConfiguring && (
            <button
              id="shortcuts-add-btn"
              onClick={() => {
                setIsAdding(!isAdding);
                setEditingPopularAppId(null);
                setTitle('');
                setUrl('');
              }}
              className="p-1.5 rounded-lg bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-550 transition-colors cursor-pointer"
              title="Add or Manage Applications"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isAdding && (
          <motion.form
            id="add-shortcut-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleFormSubmit}
            className="mb-5 p-4 bg-white/40 dark:bg-zinc-950/50 border border-zinc-200/50 dark:border-white/10 rounded-2xl overflow-hidden shadow-inner"
          >
            {/* Header of Form (div:nth-of-type(1)) */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <h4 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                  {editingPopularAppId ? 'Modify Popular Web App' : 'Add & Manage Popular Web Apps'}
                </h4>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setIsAdding(false);
                  setEditingPopularAppId(null);
                }}
                className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Container for tabs and form (div:nth-of-type(2)) */}
            <div className="space-y-4">
              {/* div:nth-of-type(1): Catalog Selector Tabs & Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
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
                  <div className="flex items-center gap-2">
                    {activeCatalogTab === 'popular' && (
                      <button
                        type="button"
                        onClick={handleResetPopularApps}
                        className="text-[10px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                        title="Restore default Popular Apps"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Reset defaults</span>
                      </button>
                    )}
                    <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                      Hover to edit or remove
                    </span>
                  </div>
                </div>

                {/* Items Grid */}
                <div 
                  id="shortcut-icon-selector" 
                  className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 bg-white/40 dark:bg-white/[0.03] p-3 border border-zinc-200/50 dark:border-white/10 rounded-2xl max-h-56 overflow-y-auto scrollbar-thin"
                >
                  {activeCatalogTab === 'popular' ? (
                    popularApps.map(app => (
                      <div
                        key={app.id}
                        className={`relative group/pop flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center ${
                          editingPopularAppId === app.id
                            ? 'bg-indigo-500/20 border-indigo-400'
                            : 'border-transparent hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        {/* Hover Action Badges: Modify & Remove */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover/pop:opacity-100 flex items-center gap-1 transition-opacity z-20">
                          <button
                            type="button"
                            onClick={(e) => handleStartEditPopularApp(app, e)}
                            className="p-1 rounded-md bg-zinc-800 text-zinc-300 hover:text-white hover:bg-indigo-600 transition-colors cursor-pointer shadow"
                            title={`Modify ${app.name}`}
                          >
                            <Edit2 className="w-2.5 h-2.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeletePopularApp(app.id, e)}
                            className="p-1 rounded-md bg-zinc-800 text-zinc-300 hover:text-red-400 hover:bg-red-950 transition-colors cursor-pointer shadow"
                            title={`Remove ${app.name} from Popular Apps`}
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Quick Pin to Google Apps Panel */}
                        <button
                          type="button"
                          onClick={(e) => handlePinToPanel(app, e)}
                          className="absolute bottom-1 right-1 opacity-0 group-hover/pop:opacity-100 p-1 rounded-md bg-zinc-800 text-zinc-300 hover:text-emerald-400 hover:bg-zinc-700 transition-opacity cursor-pointer shadow z-20"
                          title={`Pin ${app.name} to Google Apps panel`}
                        >
                          <Pin className="w-2.5 h-2.5" />
                        </button>

                        <a
                          href={app.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex flex-col items-center gap-1.5 w-full cursor-pointer"
                          title={`Open ${app.name}`}
                        >
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] group-hover/pop:scale-105 transition-transform">
                            <GoogleAppImage name={app.id} title={app.name} url={app.url} className="w-7 h-7" />
                          </div>
                          <span className="text-[11px] font-normal text-zinc-300 group-hover/pop:text-white truncate w-full">
                            {app.name}
                          </span>
                        </a>
                      </div>
                    ))
                  ) : (
                    GOOGLE_PRESET_APPS.map(app => (
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
                    ))
                  )}
                </div>
              </div>

              {/* div:nth-of-type(2): Custom Website / App URL with True Logo Live Preview */}
              <div className="pt-3 border-t border-white/10">
                {/* div:nth-of-type(1): Mode description & Destination selection */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-zinc-400 select-none">
                      {editingPopularAppId ? 'Modifying Popular Web App:' : 'Add New App:'}
                    </span>
                    <div className="inline-flex rounded-lg p-0.5 bg-black/40 border border-white/10 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setTargetDestination('popular')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                          targetDestination === 'popular'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        ★ Popular Web Apps
                      </button>
                      <button
                        type="button"
                        onClick={() => setTargetDestination('panel')}
                        className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                          targetDestination === 'panel'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Google Apps Panel
                      </button>
                    </div>
                  </div>

                  {(url || title) && (
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-300 bg-white/10 px-2 py-0.5 rounded-md self-start sm:self-auto">
                      <span className="text-zinc-400">True Logo:</span>
                      <div className="w-4 h-4 flex items-center justify-center">
                        <GoogleAppImage name="" title={previewTitle} url={url} className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>

                {/* div:nth-of-type(2): The Grid of Inputs targeting CSS selector 1 and 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    id="shortcut-form-title"
                    type="text"
                    placeholder="App Name (e.g. Discord, Twitch, Figma)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xs px-3 py-2 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                  />
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                    <input
                      id="shortcut-form-url"
                      type="text"
                      placeholder="URL (e.g. discord.com, twitch.tv)"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="text-xs pl-8 pr-3 py-2 w-full bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                    />
                  </div>
                </div>

                {validationError && (
                  <p className="text-[10px] font-mono text-red-400 mt-1.5">{validationError}</p>
                )}

                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    id="shortcut-form-submit-btn"
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 font-semibold text-white rounded-xl text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {editingPopularAppId ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Changes to Popular Web App</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>
                          {targetDestination === 'popular'
                            ? 'Add to Popular Web Apps'
                            : 'Add to Google Apps Panel'}
                        </span>
                      </>
                    )}
                  </button>

                  {editingPopularAppId && (
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Grid of Launcher Application Shortcuts */}
      <div 
        id="shortcuts-items-grid" 
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-y-6 gap-x-3 py-2"
      >
        {shortcuts.map((shortcut) => (
          <div 
            key={shortcut.id} 
            id={`shortcut-wrapper-${shortcut.id}`}
            className="relative group flex flex-col items-center"
          >
            <a
              href={shortcut.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 w-full text-center transition-all duration-200 hover:scale-[1.08] active:scale-95"
            >
              {/* Icon Container matching reference image */}
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 bg-white/[0.04] group-hover:bg-white/[0.1] border border-white/5 group-hover:border-white/20 shadow-sm group-hover:shadow-lg"
              >
                {getShortcutLogo(shortcut)}
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
        ))}

        {shortcuts.length === 0 && (
          <div className="col-span-full py-6 text-center text-xs text-zinc-400 font-mono">
            No apps configured in Google Apps. Click the settings gear icon above.
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit2, X, Check, Globe, Terminal, Mail, Compass, Code, 
  Video, MessageSquare, Cpu, Layers, Flame, ExternalLink, Settings 
} from 'lucide-react';
import { QuickShortcut } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ApplicationShortcutsProps {
  shortcuts: QuickShortcut[];
  onAddShortcut: (shortcut: Omit<QuickShortcut, 'id'>) => void;
  onUpdateShortcut: (id: string, updates: Partial<QuickShortcut>) => void;
  onDeleteShortcut: (id: string) => void;
}

const AVAILABLE_ICONS: Record<string, React.ReactNode> = {
  chrome: <Globe className="w-5 h-5" />,
  terminal: <Terminal className="w-5 h-5" />,
  mail: <Mail className="w-5 h-5" />,
  compass: <Compass className="w-5 h-5" />,
  code: <Code className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  chat: <MessageSquare className="w-5 h-5" />,
  cpu: <Cpu className="w-5 h-5" />,
  layers: <Layers className="w-5 h-5" />,
  flame: <Flame className="w-5 h-5" />
};

const COLOR_TEMPLATES = [
  { name: 'Indigo', class: 'bg-indigo-500/10 text-indigo-505 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
  { name: 'Emerald', class: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
  { name: 'Violet', class: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-300 border-violet-200 dark:border-violet-800' },
  { name: 'Orange', class: 'bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-850' },
  { name: 'Rose', class: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-800' },
  { name: 'Sky', class: 'bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
];

export default function ApplicationShortcuts({
  shortcuts,
  onAddShortcut,
  onUpdateShortcut,
  onDeleteShortcut,
}: ApplicationShortcutsProps) {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [iconName, setIconName] = useState('chrome');
  const [colorClass, setColorClass] = useState(COLOR_TEMPLATES[0].class);
  const [validationError, setValidationError] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!title.trim() || !url.trim()) {
      setValidationError('Please pack both Title and URL.');
      return;
    }

    let destUrl = url.trim();
    if (!/^https?:\/\//i.test(destUrl)) {
      destUrl = 'https://' + destUrl;
    }

    onAddShortcut({
      title: title.trim(),
      url: destUrl,
      iconName,
      color: colorClass
    });

    setTitle('');
    setUrl('');
    setIconName('chrome');
    setColorClass(COLOR_TEMPLATES[0].class);
    setIsAdding(false);
  };

  return (
    <div 
      id="shortcuts-widget-card" 
      className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-zinc-200/50 dark:border-white/10 rounded-3xl p-5 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-zinc-300/50 dark:hover:border-white/15"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-zinc-450 dark:text-zinc-450">
          <Layers className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-sans">
            Quick-Access Launcher
          </h3>
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
                : 'bg-white/60 dark:bg-white/5 text-zinc-555 hover:text-zinc-850 dark:text-zinc-350 border-zinc-200/40 dark:border-white/5'
            }`}
            title="Edit Apps List"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {isConfiguring && (
            <button
              id="shortcuts-add-btn"
              onClick={() => setIsAdding(!isAdding)}
              className="p-1.5 rounded-lg bg-indigo-500 dark:bg-indigo-600 text-white hover:bg-indigo-600 dark:hover:bg-indigo-550 transition-colors cursor-pointer"
              title="Add New Launcher"
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
            onSubmit={handleAddSubmit}
            className="mb-4 p-4 bg-white/30 dark:bg-zinc-950/20 border border-zinc-200/30 dark:border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[11px] font-bold text-zinc-450 dark:text-zinc-400 uppercase tracking-wider">
                Create Customized Launcher
              </h4>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="text-zinc-400 hover:text-zinc-650"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-zinc-805">
                <input
                  id="shortcut-form-title"
                  type="text"
                  placeholder="App Name (e.g. Gmail)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                />
                <input
                  id="shortcut-form-url"
                  type="text"
                  placeholder="URL (e.g. mail.google.com)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-xs px-2.5 py-1.5 bg-white/40 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400"
                />
              </div>

              {/* Icon Selector Grid */}
              <div>
                <p className="text-[10px] font-mono text-zinc-400 mb-1.5 select-none">Select App Icon:</p>
                <div id="shortcut-icon-selector" className="flex items-center gap-1 bg-white/40 dark:bg-white/5 p-2 border border-zinc-200/50 dark:border-white/10 rounded-xl overflow-x-auto scrollbar-none">
                  {Object.keys(AVAILABLE_ICONS).map(name => (
                    <button
                      key={name}
                      type="button"
                      id={`picker-icon-${name}`}
                      onClick={() => setIconName(name)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        iconName === name 
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent shadow-sm' 
                          : 'bg-transparent text-zinc-400 border-transparent hover:bg-white/10 dark:hover:bg-white/10'
                      }`}
                    >
                      {AVAILABLE_ICONS[name]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Chooser */}
              <div>
                <p className="text-[10px] font-mono text-zinc-400 mb-1.5 select-none">Select Circle Background Accent:</p>
                <div id="shortcut-color-selector" className="grid grid-cols-6 gap-1.5">
                  {COLOR_TEMPLATES.map((color, index) => (
                    <button
                      key={`${color.name}-${index}`}
                      type="button"
                      onClick={() => setColorClass(color.class)}
                      className={`text-[9px] font-semibold py-1 rounded border capitalize transition-all truncate text-center cursor-pointer ${
                        colorClass === color.class
                          ? 'bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent'
                          : 'bg-white/50 dark:bg-white/5 border-zinc-200/40 dark:border-white/5 text-zinc-650 dark:text-zinc-400'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {validationError && (
                <p className="text-[10px] font-mono text-red-500 mt-1">{validationError}</p>
              )}

              <button
                id="shortcut-form-submit-btn"
                type="submit"
                className="w-full py-2 bg-indigo-500 hover:bg-indigo-650 dark:bg-indigo-600 dark:hover:bg-indigo-550 font-semibold text-white rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
              >
                Add Shortcut
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Grid of Launcher Application Shortcuts */}
      <div 
        id="shortcuts-items-grid" 
        className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 py-1"
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
              className="flex flex-col items-center gap-1.5 w-full text-center transition-transform hover:scale-[1.05]"
            >
              {/* Icon Container with Custom Accent Coloring */}
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${shortcut.color} shadow-sm group-hover:shadow group-hover:border-zinc-300 dark:group-hover:border-zinc-700`}
              >
                {AVAILABLE_ICONS[shortcut.iconName] || <Globe className="w-5 h-5" />}
              </div>
              <span className="text-[11px] font-bold text-zinc-650 dark:text-zinc-300 truncate w-full px-1">
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
                  title="Remove Launcher"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        ))}

        {shortcuts.length === 0 && (
          <div className="col-span-full py-6 text-center text-xs text-zinc-400 font-mono">
            No quick launchers have been configured. Click the edit gear icon above.
          </div>
        )}
      </div>
    </div>
  );
}

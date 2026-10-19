import React, { useState, useRef } from 'react';
import { 
  X, Image as ImageIcon, Sliders, LayoutGrid, RotateCcw, 
  Upload, Link2, Check, Sparkles, Sun, Moon, Eye, EyeOff,
  Palette, Droplets, Laptop, ShieldCheck, CheckCircle2, AlertCircle,
  Bookmark, FileText, Trash2, AlertTriangle
} from 'lucide-react';
import { AppSettings, WidgetVisibility, WallpaperConfig, GlassEffectConfig } from '../types';
import { WALLPAPER_CATEGORIES, WALLPAPER_PRESETS, DEFAULT_WALLPAPER, DEFAULT_GLASS } from '../data/wallpapers';

interface GeneralSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  widgets: WidgetVisibility;
  onToggleWidget: (key: keyof WidgetVisibility) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onResetDefaults?: () => void;
  onMasterReset: () => void;
  onResetBookmarks: () => void;
  onClearAllBookmarks?: () => void;
  onResetNotes: () => void;
  onResetShortcuts: () => void;
  onResetPopularApps?: () => void;
  onResetAppearance: () => void;
  onResetWidgets: () => void;
}

export default function GeneralSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  widgets,
  onToggleWidget,
  darkMode,
  onToggleDarkMode,
  onResetDefaults,
  onMasterReset,
  onResetBookmarks,
  onClearAllBookmarks,
  onResetNotes,
  onResetShortcuts,
  onResetPopularApps,
  onResetAppearance,
  onResetWidgets,
}: GeneralSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'glass' | 'appearance' | 'widgets' | 'reset'>('wallpaper');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [urlPreviewError, setUrlPreviewError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentWallpaper: WallpaperConfig = settings.wallpaper || DEFAULT_WALLPAPER;
  const currentGlass: GlassEffectConfig = settings.glass || DEFAULT_GLASS;

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSelectPreset = (preset: typeof WALLPAPER_PRESETS[0]) => {
    const updatedWallpaper: WallpaperConfig = {
      type: preset.type,
      name: preset.name,
      value: preset.value,
      blur: currentWallpaper.blur ?? preset.defaultBlur ?? 2,
      dim: currentWallpaper.dim ?? preset.defaultDim ?? 30,
    };
    onUpdateSettings({
      ...settings,
      wallpaper: updatedWallpaper,
    });
    showFeedback(`Applied "${preset.name}"`);
  };

  const handleApplyCustomUrl = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
      setUrlPreviewError('Please enter a valid URL starting with https://');
      return;
    }
    setUrlPreviewError('');
    const updatedWallpaper: WallpaperConfig = {
      type: 'custom-url',
      name: 'Custom Web Wallpaper',
      value: trimmed,
      blur: currentWallpaper.blur ?? 3,
      dim: currentWallpaper.dim ?? 30,
    };
    onUpdateSettings({
      ...settings,
      wallpaper: updatedWallpaper,
    });
    setCustomUrlInput('');
    showFeedback('Applied custom wallpaper URL!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('Please select a valid image file');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showFeedback('Image file exceeds 8MB. Please choose a smaller image.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updatedWallpaper: WallpaperConfig = {
          type: 'upload',
          name: file.name.replace(/\.[^/.]+$/, ""),
          value: dataUrl,
          blur: currentWallpaper.blur ?? 2,
          dim: currentWallpaper.dim ?? 30,
        };
        onUpdateSettings({
          ...settings,
          wallpaper: updatedWallpaper,
        });
        showFeedback(`Uploaded "${file.name}" as wallpaper!`);
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      showFeedback('Failed to read image file');
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWallpaperSlider = (field: 'blur' | 'dim', value: number) => {
    onUpdateSettings({
      ...settings,
      wallpaper: {
        ...currentWallpaper,
        [field]: value,
      },
    });
  };

  const handleGlassUpdate = (updates: Partial<GlassEffectConfig>) => {
    onUpdateSettings({
      ...settings,
      glass: {
        ...currentGlass,
        ...updates,
      },
    });
  };

  const filteredPresets = WALLPAPER_PRESETS.filter(p => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const renderResetCenter = () => (
    <div id="reset-center-container" className="space-y-4">
      {/* Master Factory Reset (Overall Reset) */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-red-900/20 to-zinc-900/50 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-red-950/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-red-500/20 text-red-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wider text-red-200">
              Overall Master Reset (Factory Defaults)
            </h4>
          </div>
          <p className="text-[11px] text-zinc-400 max-w-xl">
            Completely restores all bookmarks, personal notes, app shortcuts, widgets layout, appearance wallpaper, and search preferences back to out-of-the-box defaults.
          </p>
        </div>
        <div className="shrink-0 flex items-center">
          {confirmAction === 'master' ? (
            <div className="flex items-center gap-2 animate-in fade-in">
              <button
                id="master-reset-confirm-btn"
                onClick={() => {
                  onMasterReset();
                  setConfirmAction(null);
                  showFeedback('✓ Master factory reset completed successfully!');
                }}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-lg"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Master Reset</span>
              </button>
              <button
                onClick={() => setConfirmAction(null)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-medium transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              id="master-reset-all-btn"
              onClick={() => setConfirmAction('master')}
              className="px-4 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 text-red-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All (Master Reset)</span>
            </button>
          )}
        </div>
      </div>

      {/* Separate Component Resets Grid */}
      <div className="p-4.5 rounded-2xl bg-white/5 border border-white/10 space-y-3.5">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>Separate Component Resets</span>
          </h4>
          <p className="text-[11px] text-zinc-400">
            Reset specific components individually without affecting the rest of your dashboard data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 1. Bookmarks Reset */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold mb-1">
                <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bookmarks & Categories</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Restore the default curated bookmarks, or wipe all saved bookmarks clean.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {confirmAction === 'bookmarks' ? (
                <div className="flex items-center gap-1.5 w-full">
                  <button
                    onClick={() => {
                      onResetBookmarks();
                      setConfirmAction(null);
                      showFeedback('✓ Bookmarks reset to default list!');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex-1 cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-2 py-1.5 rounded-lg bg-white/10 text-zinc-300 text-[11px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id="reset-bookmarks-default-btn"
                  onClick={() => setConfirmAction('bookmarks')}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Default</span>
                </button>
              )}

              {onClearAllBookmarks && (
                confirmAction === 'clear-bookmarks' ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <button
                      onClick={() => {
                        onClearAllBookmarks();
                        setConfirmAction(null);
                        showFeedback('✓ All bookmarks deleted!');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold flex-1 cursor-pointer"
                    >
                      Confirm Clear
                    </button>
                    <button
                      onClick={() => setConfirmAction(null)}
                      className="px-2 py-1.5 rounded-lg bg-white/10 text-zinc-300 text-[11px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    id="clear-all-bookmarks-btn"
                    onClick={() => setConfirmAction('clear-bookmarks')}
                    className="px-2.5 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* 2. Notes Reset */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold mb-1">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Personal Notepad</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Restore default daily checklist and developer notes, clearing custom edits.
              </p>
            </div>
            <div className="pt-1">
              {confirmAction === 'notes' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onResetNotes();
                      setConfirmAction(null);
                      showFeedback('✓ Notes notepad reset to defaults!');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex-1 cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-2 py-1.5 rounded-lg bg-white/10 text-zinc-300 text-[11px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id="reset-notes-btn"
                  onClick={() => setConfirmAction('notes')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Notes</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Shortcuts Tray & Popular Web Apps Reset */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                <span>Application Shortcuts & Web Apps</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Restore Google suite tray apps or reset the popular web applications catalog.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {confirmAction === 'shortcuts' ? (
                <div className="flex items-center gap-1.5 w-full">
                  <button
                    onClick={() => {
                      onResetShortcuts();
                      setConfirmAction(null);
                      showFeedback('✓ Tray shortcuts reset to default!');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex-1 cursor-pointer"
                  >
                    Confirm Reset Tray
                  </button>
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-2 py-1.5 rounded-lg bg-white/10 text-zinc-300 text-[11px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id="reset-shortcuts-btn"
                  onClick={() => setConfirmAction('shortcuts')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                  title="Reset tray shortcuts to default Google suite"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Tray Shortcuts</span>
                </button>
              )}

              {onResetPopularApps && (
                confirmAction === 'popular-apps' ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <button
                      onClick={() => {
                        onResetPopularApps();
                        setConfirmAction(null);
                        showFeedback('✓ Popular Web Apps reset to default catalog!');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex-1 cursor-pointer"
                    >
                      Confirm Reset Apps
                    </button>
                    <button
                      onClick={() => setConfirmAction(null)}
                      className="px-2 py-1.5 rounded-lg bg-white/10 text-zinc-300 text-[11px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    id="reset-popular-apps-btn"
                    onClick={() => setConfirmAction('popular-apps')}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                    title="Restore default catalog of Popular Web Apps"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Popular Web Apps</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* 4. Appearance & Wallpaper Reset */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-purple-300 text-xs font-bold mb-1">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span>Wallpaper & Glass Blur</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Restore default Dark Cyber Matrix wallpaper and 25% glass transparency.
              </p>
            </div>
            <div className="pt-1">
              {confirmAction === 'appearance' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onResetAppearance();
                      setConfirmAction(null);
                      showFeedback('✓ Wallpaper & glass blur reset to defaults!');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex-1 cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-2 py-1.5 rounded-lg bg-white/10 text-zinc-300 text-[11px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id="reset-appearance-btn"
                  onClick={() => setConfirmAction('appearance')}
                  className="px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Appearance</span>
                </button>
              )}
            </div>
          </div>

          {/* 5. Widgets Visibility & Preferences Reset */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5 flex flex-col justify-between sm:col-span-2">
            <div>
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold mb-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Widgets Visibility & Search / Weather</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Re-enables all 5 dashboard widgets and restores Google search engine & Celsius temperature.
              </p>
            </div>
            <div className="pt-1">
              {confirmAction === 'widgets' ? (
                <div className="flex items-center gap-1.5 max-w-xs">
                  <button
                    onClick={() => {
                      onResetWidgets();
                      setConfirmAction(null);
                      showFeedback('✓ Widgets & preferences reset to default!');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold flex-1 cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="px-2 py-1.5 rounded-lg bg-white/10 text-zinc-300 text-[11px] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id="reset-widgets-btn"
                  onClick={() => setConfirmAction('widgets')}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-200 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Widgets & Layout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      id="general-settings-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="general-settings-dialog"
        className="w-full max-w-4xl max-h-[90vh] bg-zinc-950/90 dark:bg-zinc-950/90 border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 backdrop-blur-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Header Bar */}
        <div className="px-6 py-4.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-sans tracking-tight text-white flex items-center gap-2">
                General Settings & Customization
                {feedback && (
                  <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-fade-in flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {feedback}
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">
                Change wallpaper, transparency with blur effects, widgets, and themes
              </p>
            </div>
          </div>
          <button
            id="close-general-settings-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/10 bg-black/30 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('wallpaper')}
            className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'wallpaper'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10 rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Wallpaper & Background</span>
          </button>

          <button
            onClick={() => setActiveTab('glass')}
            className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'glass'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10 rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Droplets className="w-4 h-4" />
            <span>Transparency & Blur Effect</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10 rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Appearance & Theme</span>
          </button>

          <button
            onClick={() => setActiveTab('widgets')}
            className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'widgets'
                ? 'border-indigo-400 text-indigo-300 bg-indigo-500/10 rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Widgets & Layout</span>
          </button>

          <button
            id="tab-reset-defaults-btn"
            onClick={() => setActiveTab('reset')}
            className={`px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'reset'
                ? 'border-red-400 text-red-300 bg-red-500/10 rounded-t-xl'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-white/5 rounded-t-xl'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset & Defaults</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          {/* TAB 1: WALLPAPER */}
          {activeTab === 'wallpaper' && (
            <div className="space-y-6">
              {/* Active Wallpaper Status & Controls Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Thumbnail / mini preview */}
                  <div className="w-20 h-14 rounded-xl border border-white/20 overflow-hidden relative shadow-md bg-black shrink-0">
                    {currentWallpaper.type === 'solid' ? (
                      <div className="w-full h-full" style={{ backgroundColor: currentWallpaper.value }} />
                    ) : currentWallpaper.type === 'gradient' ? (
                      <div className="w-full h-full" style={{ background: currentWallpaper.value }} />
                    ) : (
                      <img 
                        src={currentWallpaper.value} 
                        alt={currentWallpaper.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=60';
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-mono font-bold tracking-wider text-indigo-400">
                        Active Wallpaper
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                        {currentWallpaper.type}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5 truncate max-w-xs">
                      {currentWallpaper.name || 'Custom Wallpaper'}
                    </h3>
                  </div>
                </div>

                {/* Live Adjustment Sliders for Wallpaper */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 max-w-md">
                  {/* Wallpaper Blur Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-indigo-400" />
                        Wallpaper Blur:
                      </span>
                      <span className="font-mono text-white font-semibold">{currentWallpaper.blur ?? 0}px</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="20"
                      step="1"
                      value={currentWallpaper.blur ?? 0}
                      onChange={(e) => handleWallpaperSlider('blur', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>Sharp (0px)</span>
                      <span>Dreamy (20px)</span>
                    </div>
                  </div>

                  {/* Wallpaper Dimming Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        Darkness Dim:
                      </span>
                      <span className="font-mono text-white font-semibold">{currentWallpaper.dim ?? 30}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="85"
                      step="5"
                      value={currentWallpaper.dim ?? 30}
                      onChange={(e) => handleWallpaperSlider('dim', parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                      <span>Light (0%)</span>
                      <span>High Contrast (85%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Custom Wallpaper (URL or File Upload) */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  Use Your Own Wallpaper (Upload or Web URL)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* File Upload Button */}
                  <div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full h-11 px-4 rounded-xl border border-dashed border-indigo-400/40 hover:border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? 'Uploading Image...' : 'Upload Image from Computer'}</span>
                    </button>
                    <p className="text-[10px] text-zinc-500 mt-1 pl-1">
                      Supports JPG, PNG, WEBP (stored locally in browser storage)
                    </p>
                  </div>

                  {/* URL Input */}
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Link2 className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                          type="url"
                          placeholder="Paste image URL (https://...)"
                          value={customUrlInput}
                          onChange={(e) => {
                            setCustomUrlInput(e.target.value);
                            setUrlPreviewError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleApplyCustomUrl();
                          }}
                          className="w-full h-11 pl-9 pr-3 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-400"
                        />
                      </div>
                      <button
                        onClick={handleApplyCustomUrl}
                        disabled={!customUrlInput.trim()}
                        className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {urlPreviewError && (
                      <p className="text-[10px] text-red-400 mt-1 pl-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {urlPreviewError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Curated Wallpaper Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Curated High-Definition Wallpapers
                  </h4>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                    {WALLPAPER_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap ${
                          selectedCategory === cat.id
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Presets Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredPresets.map(preset => {
                    const isSelected = currentWallpaper.value === preset.value;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset)}
                        className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all duration-200 cursor-pointer aspect-video flex flex-col justify-end p-2.5 ${
                          isSelected
                            ? 'border-indigo-400 ring-2 ring-indigo-400/30 scale-[1.02]'
                            : 'border-white/10 hover:border-white/40 hover:scale-[1.01]'
                        }`}
                      >
                        {/* Background Thumbnail */}
                        {preset.type === 'solid' ? (
                          <div 
                            className="absolute inset-0 z-0" 
                            style={{ backgroundColor: preset.value }}
                          />
                        ) : preset.type === 'gradient' ? (
                          <div 
                            className="absolute inset-0 z-0" 
                            style={{ background: preset.value }}
                          />
                        ) : (
                          <img 
                            src={preset.thumbnail} 
                            alt={preset.name}
                            className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        )}

                        {/* Dark Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-1" />

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 z-2 w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}

                        {/* Title */}
                        <span className="relative z-2 text-xs font-bold text-white drop-shadow truncate">
                          {preset.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSPARENCY & BLUR EFFECT */}
          {activeTab === 'glass' && (
            <div className="space-y-6">
              {/* Glass Preview Box */}
              <div className="relative rounded-3xl p-6 overflow-hidden border border-white/20 min-h-[160px] flex items-center justify-center shadow-xl">
                {/* Background underneath preview */}
                <div 
                  className="absolute inset-0 z-0"
                  style={{
                    background: currentWallpaper.type === 'solid' 
                      ? currentWallpaper.value 
                      : currentWallpaper.type === 'gradient'
                      ? currentWallpaper.value
                      : `url(${currentWallpaper.value}) center/cover no-repeat`,
                    filter: `blur(${currentWallpaper.blur ?? 0}px)`,
                  }}
                />
                <div 
                  className="absolute inset-0 bg-black z-0 pointer-events-none"
                  style={{ opacity: (currentWallpaper.dim ?? 30) / 100 }}
                />

                {/* Interactive Sample Glass Card */}
                <div 
                  className={`relative z-10 p-5 rounded-2xl max-w-sm w-full transition-all duration-300 ${
                    currentGlass.borderGlow ? 'shadow-2xl shadow-indigo-500/10' : ''
                  }`}
                  style={{
                    backgroundColor: darkMode 
                      ? `rgba(0, 0, 0, ${currentGlass.transparency / 100})` 
                      : `rgba(255, 255, 255, ${currentGlass.transparency / 100})`,
                    backdropFilter: currentGlass.blur === 'none' 
                      ? 'none' 
                      : currentGlass.blur === 'sm' 
                      ? 'blur(8px)' 
                      : currentGlass.blur === 'md' 
                      ? 'blur(16px)' 
                      : currentGlass.blur === 'lg' 
                      ? 'blur(20px)' 
                      : currentGlass.blur === 'xl' 
                      ? 'blur(24px)' 
                      : currentGlass.blur === '2xl' 
                      ? 'blur(32px)' 
                      : 'blur(40px)',
                    WebkitBackdropFilter: currentGlass.blur === 'none' 
                      ? 'none' 
                      : currentGlass.blur === 'sm' 
                      ? 'blur(8px)' 
                      : currentGlass.blur === 'md' 
                      ? 'blur(16px)' 
                      : currentGlass.blur === 'lg' 
                      ? 'blur(20px)' 
                      : currentGlass.blur === 'xl' 
                      ? 'blur(24px)' 
                      : currentGlass.blur === '2xl' 
                      ? 'blur(32px)' 
                      : 'blur(40px)',
                    border: currentGlass.borderGlow 
                      ? '1px solid rgba(255, 255, 255, 0.25)' 
                      : '1px solid rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-mono font-bold tracking-wider text-indigo-400">
                      Live Glassmorphism Preview
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white">
                      {currentGlass.transparency}% Opacity
                    </span>
                  </div>
                  <p className="text-xs text-white/90">
                    This preview shows the exact transparency and frosted blur effect applied across all dashboard cards and widgets.
                  </p>
                </div>
              </div>

              {/* Slider 1: Card Transparency / Opacity */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-indigo-400" />
                      Card Background Transparency
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Controls how translucent dashboard widget cards are over the wallpaper.
                    </p>
                  </div>
                  <span className="text-sm font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {currentGlass.transparency}%
                  </span>
                </div>

                <input 
                  type="range"
                  min="5"
                  max="70"
                  step="5"
                  value={currentGlass.transparency}
                  onChange={(e) => handleGlassUpdate({ transparency: parseInt(e.target.value) })}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />

                <div className="flex justify-between text-xs text-zinc-400 font-mono">
                  <span>Ultra Translucent (5%)</span>
                  <span>Balanced Glass (25%)</span>
                  <span>Frosted Solid (70%)</span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] text-zinc-400 uppercase font-mono">Quick Modes:</span>
                  {[
                    { label: 'Ultra Sheer', val: 10, blur: '3xl' as const },
                    { label: 'Modern Glass (Recommended)', val: 25, blur: '2xl' as const },
                    { label: 'Frosted Smoke', val: 40, blur: 'xl' as const },
                    { label: 'Solid Matte', val: 65, blur: 'sm' as const },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => handleGlassUpdate({ transparency: preset.val, blur: preset.blur })}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/15 text-zinc-200 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 2: Backdrop Blur Strength */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Backdrop Blur Effect Strength
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Optical diffusion power applied to the background through the glass cards.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {currentGlass.blur}
                  </span>
                </div>

                {/* Blur level options */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'none', label: 'Off', desc: 'No blur' },
                    { id: 'sm', label: 'Subtle', desc: '8px' },
                    { id: 'md', label: 'Medium', desc: '16px' },
                    { id: 'lg', label: 'Smooth', desc: '20px' },
                    { id: 'xl', label: 'Heavy', desc: '24px' },
                    { id: '2xl', label: 'Frosted', desc: '32px' },
                  ].map(b => (
                    <button
                      key={b.id}
                      onClick={() => handleGlassUpdate({ blur: b.id as GlassEffectConfig['blur'] })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        currentGlass.blur === b.id
                          ? 'border-indigo-400 bg-indigo-500/20 text-white ring-2 ring-indigo-400/30'
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-xs font-bold">{b.label}</span>
                      <span className="block text-[10px] text-zinc-400 font-mono">{b.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle: Border Glass Glow */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Luminous Glass Border & Highlight</h4>
                  <p className="text-[11px] text-zinc-400">
                    Adds crisp glass edge refraction and subtle border glow.
                  </p>
                </div>
                <button
                  onClick={() => handleGlassUpdate({ borderGlow: !currentGlass.borderGlow })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentGlass.borderGlow
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border border-white/10 text-zinc-400'
                  }`}
                >
                  {currentGlass.borderGlow ? '✔ Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: APPEARANCE & THEME */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Dark / Light Mode Toggle */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                    Dark Mode Theme
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Switch between sleek dark glass and radiant light glassmorphism.
                  </p>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white border border-white/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-300" />}
                  <span>{darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}</span>
                </button>
              </div>

              {/* Accent Color Palette */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Focus Accent Highlight Color
                </h4>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-500' },
                    { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-500' },
                    { id: 'violet', name: 'Violet', bg: 'bg-violet-500' },
                    { id: 'rose', name: 'Rose', bg: 'bg-rose-500' },
                    { id: 'amber', name: 'Amber', bg: 'bg-amber-500' },
                  ].map(color => (
                    <button
                      key={color.id}
                      onClick={() => onUpdateSettings({ ...settings, accentColor: color.id })}
                      className={`w-8 h-8 rounded-full ${color.bg} border-2 transition-transform cursor-pointer flex items-center justify-center ${
                        settings.accentColor === color.id
                          ? 'border-white scale-110 ring-4 ring-white/20'
                          : 'border-transparent hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      {settings.accentColor === color.id && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Temperature Unit Preference */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Weather Temperature Unit</h4>
                  <p className="text-[11px] text-zinc-400">Choose between Celsius and Fahrenheit.</p>
                </div>
                <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateSettings({ ...settings, useCelsius: true })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      settings.useCelsius ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    °C Celsius
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ ...settings, useCelsius: false })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !settings.useCelsius ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    °F Fahrenheit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WIDGETS & LAYOUT */}
          {activeTab === 'widgets' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Visible Dashboard Widgets
                </h4>
                <p className="text-xs text-zinc-400">
                  Toggle which widgets appear on your homepage dashboard canvas.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {Object.keys(widgets).map((key) => {
                    const isVisible = widgets[key as keyof WidgetVisibility];
                    const label = 
                      key === 'clock' ? 'Digital Header Clock' :
                      key === 'quickLinks' ? 'Applications Tray & Catalog' :
                      key === 'weather' ? 'Live Geocoded Weather' :
                      key === 'notes' ? 'Personal Notes Notepad' :
                      key === 'bookmarks' ? 'Folder Bookmarks Manager' : key;

                    return (
                      <button
                        key={key}
                        onClick={() => onToggleWidget(key as keyof WidgetVisibility)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                          isVisible
                            ? 'bg-indigo-500/15 border-indigo-400/40 text-white'
                            : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isVisible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-zinc-500" />}
                          {label}
                        </span>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                          isVisible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {isVisible ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset Center with Master Reset and Separate Component Resets */}
              {renderResetCenter()}
            </div>
          )}

          {/* TAB 5: RESET & DEFAULTS */}
          {activeTab === 'reset' && (
            <div className="space-y-6">
              {renderResetCenter()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 flex items-center justify-between bg-black/40 text-xs text-zinc-400">
          <span>Changes are saved immediately to local storage</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

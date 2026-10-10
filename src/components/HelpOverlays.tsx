import { useState, useEffect } from 'react';
import { HelpCircle, Keyboard, X, ShieldAlert, Sparkles, User, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpOverlaysProps {
  onFocusSearch: () => void;
  onToggleDarkMode: () => void;
}

export default function HelpOverlays({ onFocusSearch, onToggleDarkMode }: HelpOverlaysProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Global hotkey '?' trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (
        activeEl.tagName === 'INPUT' || 
        activeEl.tagName === 'TEXTAREA' || 
        activeEl.getAttribute('contenteditable') === 'true'
      );

      if (!isInput) {
        if (e.key === '?') {
          e.preventDefault();
          setIsOpen(prev => !prev);
        } else if (e.key === 'Escape' && isOpen) {
          e.preventDefault();
          setIsOpen(false);
        } else if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          onToggleDarkMode();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggleDarkMode]);

  const shortcutKeys = [
    { key: '/', alternative: 'S', desc: 'Focus Google Search box' },
    { key: 'D', alternative: '', desc: 'Toggle Dark / Light color mode' },
    { key: '?', alternative: 'Esc', desc: 'Toggle Keyboard Help Sheet' },
    { key: 'Tab', alternative: '', desc: 'Cycle focus across interactive cards' },
    { key: 'Enter', alternative: '', desc: 'Trigger or visit focused links' },
  ];

  return (
    <>
      {/* Absolute Bottom Help Floating Button */}
      <button
        id="shortcuts-help-center-trigger-btn"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border border-zinc-200 dark:border-zinc-850 p-2.5 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
        title="Show Keyboard Shortcuts"
      >
        <Keyboard className="w-4 h-4" />
        <span className="sr-only sm:not-sr-only">Keyboard Shortcuts</span>
      </button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div id="help-shortcuts-backdrop-container" className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              id="help-shortcuts-dialog-card"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button
                id="close-help-dialog-btn"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-indigo-500/10 text-indigo-505 dark:bg-indigo-500/20 dark:text-indigo-300 p-2 rounded-xl">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-zinc-850 dark:text-zinc-50 text-base">
                    Keyboard Shortcuts Overlay
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-medium">Navigate your custom homepage hands-free</p>
                </div>
              </div>

              <div className="space-y-3">
                {shortcutKeys.map((item, index) => (
                  <div 
                    key={index} 
                    id={`shortcut-help-row-${index}`}
                    className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-850"
                  >
                    <span className="text-xs text-zinc-600 dark:text-zinc-350 font-medium leading-normal">
                      {item.desc}
                    </span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-1 text-[10px] font-bold font-mono text-zinc-800 bg-zinc-100 border border-zinc-200 dark:text-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 shadow-[0_1.5px_0_rgba(0,0,0,0.1)] rounded-md">
                        {item.key}
                      </kbd>
                      {item.alternative && (
                        <>
                          <span className="text-[10px] text-zinc-420 font-mono">or</span>
                          <kbd className="px-2 py-1 text-[10px] font-bold font-mono text-zinc-800 bg-zinc-100 border border-zinc-200 dark:text-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 shadow-[0_1.5px_0_rgba(0,0,0,0.1)] rounded-md">
                            {item.alternative}
                          </kbd>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3.5 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-850/50 flex gap-2.5 items-start">
                <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-480 dark:text-zinc-400 leading-normal">
                  <span className="font-semibold block text-zinc-600 dark:text-zinc-300">Accessibility Information:</span>
                  Tabbing highlights individual interactive widgets. Use <kbd className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-[9px] rounded font-mono">Tab</kbd> to jump between sections, and configure locations or notes at lightning speed.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

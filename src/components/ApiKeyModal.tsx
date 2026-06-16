import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff, Key } from 'lucide-react';
import { PROVIDERS, getStoredApiKey, storeApiKey } from '../utils/providers';
import type { ProviderId } from '../utils/providers';

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ApiKeyModal({ open, onClose, onSaved }: ApiKeyModalProps) {
  const [keys, setKeys] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const id of Object.keys(PROVIDERS) as ProviderId[]) {
      initial[id] = getStoredApiKey(id);
    }
    return initial;
  });
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const updateKey = (id: ProviderId, value: string) => {
    setKeys((prev) => ({ ...prev, [id]: value }));
  };

  const toggleVisible = (id: ProviderId) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    for (const id of Object.keys(PROVIDERS) as ProviderId[]) {
      storeApiKey(id, keys[id] ?? '');
    }
    onSaved();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-slate-700 w-full max-w-lg mx-4 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="font-semibold text-zinc-800 dark:text-slate-200">
                  API Key 配置
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {(Object.entries(PROVIDERS) as [ProviderId, typeof PROVIDERS[ProviderId]][]).map(
                ([id, provider]) => (
                  <div key={id}>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-slate-300 mb-1.5">
                      {provider.name}
                    </label>
                    <div className="relative">
                      <input
                        type={visible[id] ? 'text' : 'password'}
                        value={keys[id] ?? ''}
                        onChange={(e) => updateKey(id, e.target.value)}
                        placeholder={`输入 ${provider.name} API Key...`}
                        className="w-full px-3 py-2.5 pr-20 text-sm bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all dark:text-slate-200 dark:placeholder-slate-500"
                      />
                      <button
                        onClick={() => toggleVisible(id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                      >
                        {visible[id] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-zinc-100 dark:border-slate-700">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
              >
                保存
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

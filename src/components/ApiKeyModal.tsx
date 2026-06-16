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
            className="bg-surface dark:bg-surface rounded-2xl shadow-xl border border-border w-full max-w-lg mx-4 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-text-primary">
                  API Key 配置
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-secondary hover:bg-surface-subtle transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {(Object.entries(PROVIDERS) as [ProviderId, typeof PROVIDERS[ProviderId]][]).map(
                ([id, provider]) => (
                  <div key={id}>
                    <label className="block text-sm font-semibold text-text-primary mb-1.5">
                      {provider.name}
                    </label>
                    <div className="relative">
                      <input
                        type={visible[id] ? 'text' : 'password'}
                        value={keys[id] ?? ''}
                        onChange={(e) => updateKey(id, e.target.value)}
                        placeholder={`输入 ${provider.name} API Key...`}
                        className="w-full px-3 py-2.5 pr-20 text-sm bg-canvas border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                      <button
                        onClick={() => toggleVisible(id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-text-secondary"
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

            <div className="flex justify-end gap-3 p-4 border-t border-border-light">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-subtle rounded-xl transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 text-sm font-medium bg-primary hover:bg-primary-dark text-surface rounded-xl transition-colors"
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

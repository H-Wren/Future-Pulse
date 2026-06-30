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
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/30"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border-2 border-border rounded-[6px] w-full max-w-lg mx-4 overflow-hidden"
          >
            <div className="editorial-topbar">
              <div className="flex items-center gap-2">
                <Key className="w-3.5 h-3.5" />
                <span>API Key 配置</span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-[4px] text-text-muted hover:text-text-primary hover:bg-surface-subtle transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[60vh] overflow-y-auto">
              {(Object.entries(PROVIDERS) as [ProviderId, typeof PROVIDERS[ProviderId]][]).map(
                ([id, provider]) => (
                  <div key={id}>
                    <label className="editorial-mono-label block text-text-muted mb-2">
                      {provider.name}
                    </label>
                    <div className="relative">
                      <input
                        type={visible[id] ? 'text' : 'password'}
                        value={keys[id] ?? ''}
                        onChange={(e) => updateKey(id, e.target.value)}
                        placeholder={`输入 ${provider.name} API Key...`}
                        className="editorial-input pr-10"
                      />
                      <button
                        onClick={() => toggleVisible(id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-text-muted hover:text-text-secondary"
                        tabIndex={-1}
                      >
                        {visible[id] ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="flex justify-end gap-2 p-4 border-t-2 border-border-light">
              <button onClick={onClose} className="editorial-btn-ghost editorial-btn text-[0.6875rem]">
                取消
              </button>
              <button onClick={handleSave} className="editorial-btn text-[0.6875rem]">
                保存
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileDown, FileText, Copy, Check } from 'lucide-react';

interface ExportMenuProps {
  content: string;
}

export default function ExportMenu({ content }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const downloadMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `future-pulse-report-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const downloadText = () => {
    const text = content
      .replace(/#{1,6}\s/g, '')
      .replace(/\|/g, '')
      .replace(/[*_~`]/g, '')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `future-pulse-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setOpen(false);
  };

  const printPdf = () => {
    window.print();
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary bg-surface hover:bg-surface-subtle px-2.5 py-1.5 rounded-lg transition-colors"
      >
        <Download className="w-3.5 h-3.5" />
        导出
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-44 bg-surface dark:bg-surface rounded-xl shadow-lg border border-border overflow-hidden z-20"
          >
            <button
              onClick={downloadMarkdown}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-subtle transition-colors"
            >
              <FileDown className="w-4 h-4 text-primary" />
              Markdown (.md)
            </button>
            <button
              onClick={downloadText}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-subtle transition-colors"
            >
              <FileText className="w-4 h-4 text-text-muted" />
              纯文本 (.txt)
            </button>
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-subtle transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-success" />
              ) : (
                <Copy className="w-4 h-4 text-text-muted" />
              )}
              {copied ? '已复制' : '复制到剪贴板'}
            </button>
            <button
              onClick={printPdf}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-primary hover:bg-surface-subtle transition-colors border-t border-border-light"
            >
              <FileText className="w-4 h-4 text-accent-gold" />
              打印 / PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

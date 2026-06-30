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
        className="font-mono text-[0.5625rem] font-[500] tracking-[0.14em] uppercase text-text-muted hover:text-text-primary px-2 py-1 rounded-[4px] hover:bg-surface-subtle transition-colors border border-transparent hover:border-border"
      >
        <Download className="w-3 h-3 inline mr-1 align-middle" />
        导出
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-40 bg-surface border-2 border-border rounded-[6px] overflow-hidden z-20"
          >
            <button onClick={downloadMarkdown}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[0.75rem] text-text-primary hover:bg-surface-subtle transition-colors font-[500]"
            >
              <FileDown className="w-3.5 h-3.5 text-primary shrink-0" />
              Markdown
            </button>
            <button onClick={downloadText}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[0.75rem] text-text-primary hover:bg-surface-subtle transition-colors font-[500]"
            >
              <FileText className="w-3.5 h-3.5 text-text-muted shrink-0" />
              纯文本
            </button>
            <button onClick={copyToClipboard}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[0.75rem] text-text-primary hover:bg-surface-subtle transition-colors font-[500]"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-success shrink-0" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-text-muted shrink-0" />
              )}
              {copied ? '已复制' : '复制'}
            </button>
            <button onClick={printPdf}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[0.75rem] text-text-primary hover:bg-surface-subtle transition-colors font-[500] border-t-2 border-border-light"
            >
              <FileText className="w-3.5 h-3.5 text-rose shrink-0" />
              打印 / PDF
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

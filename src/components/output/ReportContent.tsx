import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReportContentProps {
  content: string;
}

export default function ReportContent({ content }: ReportContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, staggerChildren: 0.05 }}
      className="prose prose-zinc dark:prose-invert prose-sm sm:prose-base max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-900 dark:prose-headings:text-slate-100
        prose-h1:text-2xl prose-h1:border-b prose-h1:border-zinc-100 dark:prose-h1:border-slate-700 prose-h1:pb-4 prose-h1:mb-8
        prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4
        prose-h4:text-base prose-h4:text-indigo-900 dark:prose-h4:text-indigo-300 prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-3
        prose-p:text-zinc-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
        prose-strong:text-zinc-900 dark:prose-strong:text-slate-100 prose-strong:font-semibold
        prose-ul:my-4 prose-li:text-zinc-600 dark:prose-li:text-slate-300 prose-li:marker:text-indigo-400
        prose-table:w-full prose-table:border-collapse prose-table:text-sm prose-table:my-6
        prose-th:bg-zinc-50/80 dark:prose-th:bg-slate-800 prose-th:p-3 prose-th:border prose-th:border-zinc-200 dark:prose-th:border-slate-700 prose-th:text-left prose-th:text-zinc-800 dark:prose-th:text-slate-200 prose-th:font-semibold
        prose-td:p-3 prose-td:border prose-td:border-zinc-200 dark:prose-td:border-slate-700 prose-td:text-zinc-600 dark:prose-td:text-slate-300 prose-td:align-top
        prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-indigo-800 dark:hover:prose-a:text-indigo-300"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </motion.div>
  );
}

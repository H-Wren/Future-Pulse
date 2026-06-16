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
      transition={{ duration: 0.4 }}
      className="prose prose-zinc dark:prose-invert prose-sm sm:prose-base max-w-none
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-text-primary
        prose-h1:text-2xl prose-h1:border-b prose-h1:border-border prose-h1:pb-4 prose-h1:mb-8
        prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-4
        prose-h4:text-base prose-h4:text-primary prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-3
        prose-p:text-text-secondary prose-p:leading-relaxed
        prose-strong:text-text-primary prose-strong:font-semibold
        prose-ul:my-4 prose-li:text-text-secondary prose-li:marker:text-primary
        prose-table:w-full prose-table:border-collapse prose-table:text-sm prose-table:my-6
        prose-th:bg-surface-subtle prose-th:p-3 prose-th:border prose-th:border-border prose-th:text-left prose-th:text-text-primary prose-th:font-semibold
        prose-td:p-3 prose-td:border prose-td:border-border prose-td:text-text-secondary prose-td:align-top
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-dark"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </motion.div>
  );
}

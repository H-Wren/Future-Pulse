import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ReportContentProps {
  content: string;
}

/** Custom renderers for report markdown */
const components: Record<string, React.ComponentType<any>> = {
  h1: ({ children }: any) => (
    <h1 className="editorial-heading-xl text-primary mt-0 mb-6 pb-4 border-b-2 border-border">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="editorial-heading text-primary mt-10 mb-4 pb-2 border-b-2 border-border flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-accent inline-block shrink-0" />
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="editorial-heading-sm text-primary mt-8 mb-3">
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className="font-mono text-[0.625rem] font-[500] tracking-[0.18em] uppercase text-accent mt-6 mb-2">
      {children}
    </h4>
  ),
  p: ({ children }: any) => (
    <p className="editorial-body mb-4 last:mb-0">{children}</p>
  ),
  strong: ({ children }: any) => (
    <strong className="font-[500] text-text-primary">{children}</strong>
  ),
  ul: ({ children }: any) => (
    <ul className="space-y-2 my-4">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="space-y-2 my-4 list-decimal pl-6">{children}</ol>
  ),
  li: ({ children }: any) => (
    <li className="editorial-body flex items-start gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-[0.6em]" />
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-[3px] border-accent pl-4 py-1 my-6 bg-surface-subtle rounded-r-[4px] editorial-body italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="editorial-rule my-8" />,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-6 border-2 border-border rounded-[6px]">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="bg-surface-subtle font-mono text-[0.625rem] tracking-[0.1em] uppercase">
      {children}
    </thead>
  ),
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => (
    <tr className="border-b border-border last:border-b-0">{children}</tr>
  ),
  th: ({ children }: any) => (
    <th className="px-4 py-2.5 text-left font-[500] text-text-primary">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="px-4 py-2.5 text-text-secondary align-top">{children}</td>
  ),
  a: ({ href, children }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="text-primary underline decoration-1 underline-offset-2 hover:text-primary-dark transition-colors">
      {children}
    </a>
  ),
  pre: ({ children }: any) => (
    <pre className="bg-surface-subtle border-2 border-border rounded-[6px] p-4 overflow-x-auto my-4 font-mono text-[0.75rem] leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ children }: any) => (
    <code className="font-mono text-[0.75rem] bg-surface-subtle px-1 py-0.5 rounded-[3px] text-rose">
      {children}
    </code>
  ),
};

export default function ReportContent({ content }: ReportContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-none"
      style={{ fontFamily: "'Source Serif 4', 'Noto Serif SC', Georgia, serif" }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}

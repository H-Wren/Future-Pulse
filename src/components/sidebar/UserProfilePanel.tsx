import { FileText, Target, Zap, Loader2, UserCircle } from 'lucide-react';

interface UserProfilePanelProps {
  resume: string;
  focus: string;
  isGenerating: boolean;
  onResumeChange: (value: string) => void;
  onFocusChange: (value: string) => void;
  onGenerate: () => void;
}

export default function UserProfilePanel({
  resume,
  focus,
  isGenerating,
  onResumeChange,
  onFocusChange,
  onGenerate,
}: UserProfilePanelProps) {
  const isValid = resume.trim().length >= 20 && focus.trim().length >= 2;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-zinc-200 dark:border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-zinc-100 dark:border-slate-700/50 bg-zinc-50/80 dark:bg-slate-800/90 flex items-center gap-2">
        <UserCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="font-semibold text-zinc-800 dark:text-slate-200 text-sm tracking-wide">
          用户核心资产分析 (Profile)
        </h2>
      </div>

      <div className="p-5 space-y-6">
        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
              当前简历能力域
            </div>
            <span className="text-xs text-zinc-400 dark:text-slate-500 font-normal">{resume.length} 字</span>
          </label>
          <textarea
            value={resume}
            onChange={(e) => onResumeChange(e.target.value)}
            className="w-full h-56 p-3 text-sm bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all resize-none shadow-inner leading-relaxed dark:text-slate-200 dark:placeholder-slate-500"
            placeholder="粘贴您的简历内容..."
          />
        </div>

        <div className="space-y-2.5">
          <label className="flex items-center justify-between text-sm font-semibold text-zinc-800 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-zinc-400 dark:text-slate-500" />
              本轮提效与重构焦点
            </div>
          </label>
          <textarea
            value={focus}
            onChange={(e) => onFocusChange(e.target.value)}
            rows={2}
            className="w-full p-3 text-sm bg-zinc-50 dark:bg-slate-900/60 border border-zinc-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all resize-none shadow-inner leading-relaxed dark:text-slate-200 dark:placeholder-slate-500"
            placeholder="例如：产品经理转型、编校准确、项目管理、品牌效应"
          />
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !isValid}
          className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 px-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              正在接入全球 AI 数据流...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              生成算力边界专属报告
            </>
          )}
        </button>
      </div>
    </div>
  );
}

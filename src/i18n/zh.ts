const zh: Record<string, string> = {
  'app.title': 'Future Pulse',
  'app.subtitle': '个人 AI 情报工作台',
  'app.version': 'v3.0',

  'header.status.online': '系统就绪 · 直连深度求索',

  // Sidebar — UserProfilePanel
  'sidebar.header': '情报控制台',
  'sidebar.apiKey': 'API 密钥',
  'sidebar.timeRange.label': '情报时间范围',
  'sidebar.provider.label': 'AI 模型',
  'sidebar.pdf.upload': '上传 PDF',
  'sidebar.pdf.parsed': '已解析',
  'sidebar.pdf.parsing': '解析中…',
  'sidebar.pdf.error': '解析失败',
  'sidebar.resume.label': '能力域资产',
  'sidebar.resume.placeholder': '粘贴文本或点击上方按钮上传 PDF 自动解析…',
  'sidebar.reportLang.label': '报告语言',
  'sidebar.focus.label': '提效焦点',
  'sidebar.focus.placeholder': '例如：产品经理转型、项目管理、品牌效应',
  'sidebar.generate': '生成情报报告',
  'sidebar.generating': '情报采集中…',
  'sidebar.footer.status': 'DeepSeek · 国内直连',

  // Time range values
  'timeRange.3d': '3 天内',
  'timeRange.1w': '一周内',
  'timeRange.1m': '一个月内',
  'timeRange.3m': '三个月内',

  // Report language
  'reportLang.zh': '中文报告',
  'reportLang.en': 'English Report',

  // Output
  'output.title': '情报终端输出',
  'output.complete': '分析完成',
  'output.empty.title': '终端已就绪，等待获取指令',
  'output.empty.hint': '填写左侧信息后点击生成，获取专属 AI 技术情报报告',
  'output.loading.title': '正在采集全球 AI 情报…',
  'output.loading.hint': '检索最新 AI 动态，与您的能力域进行深度对齐分析。',
  'output.error.retry': '点击重试',
  'output.export': '导出',
  'output.export.markdown': 'Markdown',
  'output.export.text': '纯文本',
  'output.export.pdf': 'PDF',

  // Settings
  'settings.apiKey.title': 'API Key 配置',
  'settings.apiKey.save': '保存',
  'settings.apiKey.cancel': '取消',
  'settings.apiKey.invalid': '请输入有效的 API Key',
  'settings.model.label': '模型',

  // History
  'history.title': '历史报告',
  'history.empty': '暂无历史报告',
  'history.clear': '清空全部',
  'history.compare': '对比',
  'history.compare.title': '报告对比',
  'history.delete': '删除',

  // Theme
  'theme.light': '亮色',
  'theme.dark': '暗色',

  // Language
  'lang.switch': 'EN',
  'lang.label': '语言',

  // Shortcuts
  'shortcut.generate': 'Ctrl+Enter 生成报告',
  'shortcut.history': 'Ctrl+H 历史',
  'shortcut.export': 'Ctrl+E 导出',

  // Validation
  'validation.resume.min': '简历至少 20 个字符',
  'validation.resume.max': '简历最多 5000 个字符',
  'validation.focus.required': '请输入本轮提效与重构焦点',
  'validation.focus.max': '焦点最多 200 个字符',

  // Common
  'common.retry': '重试',
  'common.cancel': '取消',
  'common.save': '保存',
  'common.loading': '加载中…',
  'common.charCount': '{count} 字',
};

export default zh;

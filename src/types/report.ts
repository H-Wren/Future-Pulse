/** 生成报告的状态 */
export type ReportStatus = 'idle' | 'generating' | 'complete' | 'error';

export interface ReportState {
  status: ReportStatus;
  content: string;
  error: string;
}

export interface GenerateReportParams {
  resume: string;
  focus: string;
}

export interface SavedReport {
  id: string;
  createdAt: number;
  providerId: string;
  model: string;
  resumeSnippet: string;
  focus: string;
  content: string;
}

export interface SurveyChartDatasetItem {
  label: string;
  count: number;
}

export interface SurveyChart {
  question_id: string;
  label: string;
  chart_type: string;
  dataset: SurveyChartDatasetItem[];
}

export interface SurveyStats {
  survey_id: number;
  meta: {
    title: string;
    description: string | null;
    total_responses: number;
  };
  charts: SurveyChart[];
}

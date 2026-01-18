export interface Survey {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  isActive: boolean;
  formId: number;
  templateId: number;
}

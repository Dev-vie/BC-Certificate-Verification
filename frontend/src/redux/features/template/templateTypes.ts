export type TemplateStatus = "Active" | "Draft";

export interface TemplatePlaceholder {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontFamily: string;
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
  color: string;
  align: "left" | "center" | "right";
}

export interface Template {
  id: string;
  title: string;
  category: string;
  status: TemplateStatus;

  fieldsCount: number;
  date: string;
  gradientClass: string;
  templateFileName?: string;
  templateFileType?: string;
  templateFileUrl?: string;
  filePath?: string;

  placeholders?: any;
}

export interface CreateTemplatePayload {
  title: string;
  placeholders?: string;
  file: File;
}

export interface UpdateTemplatePayload {
  id: string;
  data: Partial<
    Pick<Template, "title" | "category" | "status" | "fieldsCount">
  >;
}

export interface UpdatePlaceholdersPayload {
  id: string;
  placeholders: any;
  fieldsCount: number;
}

export type TemplateFilterTab = "All" | "Active" | "Draft";

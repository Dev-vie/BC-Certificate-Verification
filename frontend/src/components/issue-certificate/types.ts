export interface IssueCertificateTemplate {
  id: string;
  title: string;
  category: string;
  fieldsCount: number;
  date: string;
  gradientClass: string;
  templateFileName?: string;
  templateFileType?: string;
  templateFileUrl?: string;
  filePath?: string;
}

export interface IssueCertificateFormValues {
  recipientName: string;
  recipientEmail: string;
  recipientId: string;
  courseProgram: string;
  grade: string;
  issueDate: string;
}

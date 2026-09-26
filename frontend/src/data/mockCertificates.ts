export interface Certificate {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientId: string;
  courseProgram: string;
  grade: string;
  issueDate: string;
  status: 'Verified' | 'Pending' | 'Revoked';
  blockchainHash: string;
  avatarBg: string;
  avatarInitials: string;
}

export const mockCertificates: Certificate[] = [
  {
    id: 'CERT-2024-8821',
    recipientName: 'Amara Okafor',
    recipientEmail: 'amara.okafor@gmail.com',
    recipientId: 'STU-2024-8821',
    courseProgram: 'Advanced Web Development',
    grade: 'A+',
    issueDate: '2024-11-15',
    status: 'Revoked',
    blockchainHash: '0x3f4a..9c12',
    avatarBg: 'bg-emerald-100 text-emerald-700',
    avatarInitials: 'AO',
  },
  {
    id: 'CERT-2024-8820',
    recipientName: 'Liam Nakamura',
    recipientEmail: 'liam.n@outlook.com',
    recipientId: 'STU-2024-8820',
    courseProgram: 'Data Science Fundamentals',
    grade: 'A',
    issueDate: '2024-11-14',
    status: 'Verified',
    blockchainHash: '0xa7b2..4e81',
    avatarBg: 'bg-rose-100 text-rose-700',
    avatarInitials: 'LN',
  },
  {
    id: 'CERT-2024-8819',
    recipientName: 'Sofia Reyes',
    recipientEmail: 's.reyes@icloud.com',
    recipientId: 'STU-2024-8819',
    courseProgram: 'Cloud Architecture',
    grade: 'B+',
    issueDate: '2024-11-12',
    status: 'Pending',
    blockchainHash: '0x—',
    avatarBg: 'bg-teal-100 text-teal-700',
    avatarInitials: 'SR',
  },
  {
    id: 'CERT-2024-8818',
    recipientName: 'Kwame Asante',
    recipientEmail: 'k.asante@proton.me',
    recipientId: 'STU-2024-8818',
    courseProgram: 'Cybersecurity Essentials',
    grade: 'A',
    issueDate: '2024-11-10',
    status: 'Verified',
    blockchainHash: '0x1c9f..7d33',
    avatarBg: 'bg-amber-100 text-amber-700',
    avatarInitials: 'KA',
  },
  {
    id: 'CERT-2024-8817',
    recipientName: 'Priya Sharma',
    recipientEmail: 'priya.s@gmail.com',
    recipientId: 'STU-2024-8817',
    courseProgram: 'Machine Learning',
    grade: 'A+',
    issueDate: '2024-11-08',
    status: 'Verified',
    blockchainHash: '0xb82a..0f11',
    avatarBg: 'bg-indigo-100 text-indigo-700',
    avatarInitials: 'PS',
  },
  {
    id: 'CERT-2024-8816',
    recipientName: 'Marcus Chen',
    recipientEmail: 'm.chen@company.io',
    recipientId: 'STU-2024-8816',
    courseProgram: 'UX Design Principles',
    grade: 'B',
    issueDate: '2024-11-05',
    status: 'Revoked',
    blockchainHash: '0xd4e1..a2c7',
    avatarBg: 'bg-sky-100 text-sky-700',
    avatarInitials: 'MC',
  },
];

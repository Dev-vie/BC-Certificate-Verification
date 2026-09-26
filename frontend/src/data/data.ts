import { Shield, CheckCircle2, Users, TrendingUp } from 'lucide-react';
export const stats = [
  {
    label: 'TOTAL ISSUED',
    value: '1,284',
    sub: '↑ +12% this month',
    subColor: 'text-[#3D876C]',
    icon: Shield,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#3D876C]',
  },
  {
    label: 'VERIFIED TODAY',
    value: '47',
    sub: '↑ +8 vs yesterday',
    subColor: 'text-[#3D876C]',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#3D876C]',
  },
  {
    label: 'ACTIVE RECIPIENTS',
    value: '938',
    sub: 'Across 14 programs',
    subColor: 'text-slate-400',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
  },
  {
    label: 'VERIFICATION RATE',
    value: '94.2%',
    sub: 'Last 30 days',
    subColor: 'text-slate-400',
    icon: TrendingUp,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
];

export const programData = [
  { name: 'AWS Cloud', value: 320, color: '#3D876C' },
  { name: 'Data Science', value: 280, color: '#3D876C' },
  { name: 'Cybersecurity', value: 200, color: '#3D876C' },
  { name: 'PM Pro', value: 160, color: '#3D876C' },
  { name: 'X Research', value: 140, color: '#3D876C' },
  { name: 'DevOps', value: 100, color: '#3D876C' },
];
